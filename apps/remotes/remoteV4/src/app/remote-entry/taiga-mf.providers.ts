import { inject, type Provider } from '@angular/core';
import {
  TUI_ALERT_OPTIONS,
  TUI_ALERTS,
  type TuiAlertOptions,
  TuiAlertComponent,
  TuiAlertService,
} from '@taiga-ui/core';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { EMPTY, type Observable } from 'rxjs';
import { getAlertBus, type MfAlertOptions } from '../../../../../../shared/alert-bus';

/**
 * Drop-in replacement for `TuiAlertService`: components keep injecting the stock
 * service, but alerts are routed through the shared bus so the host renders them
 * in its single portal (see {@link getAlertBus}). When no host is listening
 * (remote running on its own), it falls back to the real service.
 */
export class TuiMfAlertService extends TuiAlertService {
  private readonly bus = getAlertBus();

  override open<G = void>(
    content: PolymorpheusContent,
    options: Partial<TuiAlertOptions<G>> = {},
  ): Observable<G> {
    if (this.bus.hasListeners()) {
      // Pass the Polymorpheus content through untouched — the bus is in-process,
      // so the host can render the very same string/template/component. The host
      // returns its cold open() Observable; we hand it back so our caller's
      // subscription drives the alert and receives its result (completeWith).
      // `find(Boolean)` picks the first listener that actually rendered (returned
      // an Observable), so passive observers (e.g. a debug recorder returning
      // void) never shadow the host regardless of subscription order.
      const result = this.bus
        .publish<G>({ content, options: options as MfAlertOptions<G>, source: 'remoteV4' })
        .find(Boolean);

      return result ?? EMPTY;
    }

    return super.open(content, options);
  }
}

/**
 * Swaps Taiga's alert services for bus-routing ones. Provide it on the remote's
 * entry injector — nothing else in the remote needs to change.
 *
 * `TuiAlertService` ships as a `useFactory` provider (it is built with explicit
 * args, not Angular DI), so the override is wired the same way.
 */
export function provideTaigaMf(): Provider[] {
  return [
    {
      provide: TuiAlertService,
      useFactory: () =>
        new TuiMfAlertService(TUI_ALERTS, TuiAlertComponent, inject(TUI_ALERT_OPTIONS)),
    },
  ];
}
