import { Injectable, type Provider } from '@angular/core';
import { TUI_VERSION } from '@taiga-ui/cdk/constants';
import { TuiNotificationService, type TuiNotificationOptions } from '@taiga-ui/core';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { EMPTY, type Observable } from 'rxjs';
import { getAlertBus, type MfAlertOptions } from '../../../../../../shared/alert-bus';

/**
 * Drop-in replacement for `TuiNotificationService`: components keep injecting
 * the stock service, but alerts are routed through the shared bus so the host
 * renders them in its single portal (see {@link getAlertBus}). When no host is
 * listening (remote running on its own), it falls back to the real service.
 */
@Injectable()
export class TuiMfNotificationService extends TuiNotificationService {
  private readonly bus = getAlertBus();

  override open<G = void>(
    content: PolymorpheusContent,
    options: Partial<TuiNotificationOptions<G>> = {},
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
        .publish<G>({
          content,
          options: options as MfAlertOptions<G>,
          source: 'remoteV5',
          version: TUI_VERSION,
        })
        .find(Boolean);

      return result ?? EMPTY;
    }

    return super.open(content, options);
  }
}

/**
 * Swaps Taiga's alert services for bus-routing ones. Provide it on the remote's
 * entry injector — nothing else in the remote needs to change.
 */
export function provideTaigaMf(): Provider[] {
  return [{ provide: TuiNotificationService, useClass: TuiMfNotificationService }];
}
