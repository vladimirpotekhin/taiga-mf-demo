/**
 * Framework- and version-agnostic alert bus shared across the host and every
 * remote on the page.
 *
 * Each Taiga UI copy (host v4/v5, remote v4/v5) renders alerts into its own
 * `tui-root` portal, so on the `/both` page several full-viewport overlays
 * stack at the same coordinates and visually overlap. Taiga v4 and v5 also use
 * completely different alert engines (`TUI_ALERTS` stream vs `TuiPopupService`
 * portal), so there is no common Taiga API both could push into.
 *
 * Instead remotes publish a plain payload here and the host opens the alert with
 * its own Taiga, so everything lands in a single portal and stacks correctly.
 *
 * The bus instance lives on `globalThis`, so it stays a singleton even though
 * each app bundles its own copy of this file (Taiga is intentionally not in the
 * Module Federation shared scope).
 */

import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';

/**
 * Options accepted by an alert/notification, forwarded verbatim to the host's
 * `open()`. This is the subset common to Taiga v4 `TuiAlertOptions` and v5
 * `TuiNotificationOptions` — those concrete types live in `@taiga-ui/core`,
 * differ across majors and are deliberately *not* MF-shared, so we describe the
 * stable shape structurally instead of importing either one. The index
 * signature lets any version-specific extra option pass straight through.
 *
 * `T` is the value the content reports back (e.g. via `context.completeWith`),
 * surfaced as `data` and as the `Observable<T>` that `open()` returns.
 */
export interface MfAlertOptions<T = unknown> {
  readonly label?: PolymorpheusContent;
  readonly appearance?: string;
  readonly autoClose?: number | boolean;
  readonly icon?: PolymorpheusContent;
  readonly closeable?: boolean;
  /** Data handed to component/template content via `injectContext`. */
  readonly data?: T;
  /** Any other version-specific option, passed straight to the host's `open()`. */
  readonly [option: string]: unknown;
}

export interface MfAlertPayload<T = unknown> {
  /**
   * Polymorpheus alert content exactly as passed to `open()` — a string, a
   * `TemplateRef` or a component. Typed via `@taiga-ui/polymorpheus`'s
   * `PolymorpheusContent` (a *type-only* import, erased at runtime, so the bus
   * stays dependency-free); the type is identical across the v4/v5 copies. The
   * bus is an in-process `globalThis` singleton, so this is a live object
   * reference crossing the MF boundary with no serialization. Strings and
   * `TemplateRef`s render anywhere (a template keeps its own declaration
   * injector); a component-type content is instantiated by the *host's*
   * injector, so it relies on `@taiga-ui/polymorpheus` being a cross-major MF
   * singleton (see `makeCrossMajorSingletonShared`) to keep one
   * `PolymorpheusComponent` / `POLYMORPHEUS_CONTEXT` identity across v4/v5.
   * Full rationale: docs/ALERT_BUS.md.
   */
  readonly content: PolymorpheusContent;
  /** Full alert options forwarded verbatim to the host's `open()`. */
  readonly options?: MfAlertOptions<T>;
  /** Which remote emitted it — handy for debugging / labelling. */
  readonly source?: string;
}

/**
 * A bus listener. The host registers one that returns the cold `open()`
 * Observable (so the publisher can subscribe to it); passive listeners (e.g. a
 * debug recorder) return nothing.
 */
export type MfAlertListener = (alert: MfAlertPayload) => Observable<unknown> | void;

export interface MfAlertBus {
  /**
   * Hand the alert to every listener and return what each one produced. The host
   * listener returns the cold Observable from its own `open()` *without*
   * subscribing, so the remote that published can subscribe to it instead — the
   * alert then shows once and its result (e.g. a `completeWith` value) flows back
   * to the remote's reactive chain. Returns one entry per listener.
   */
  publish<T>(alert: MfAlertPayload<T>): ReadonlyArray<Observable<T> | undefined>;
  subscribe(listener: MfAlertListener): () => void;
  /** True when a host is listening; remotes use it to decide on a fallback. */
  hasListeners(): boolean;
}

declare global {
  // The bus is pinned to a namespaced global key so it stays one instance across
  // every Taiga copy on the page (see file header). Typing it here lets
  // `getAlertBus()` touch the global with no casts.
  // eslint-disable-next-line no-var
  var __TAIGA_MF_ALERT_BUS__: MfAlertBus | undefined;
}

function createBus(): MfAlertBus {
  const listeners = new Set<MfAlertListener>();

  return {
    publish<T>(alert: MfAlertPayload<T>) {
      // Snapshot so a listener that (un)subscribes while handling can't break iteration.
      return [...listeners].map((listener) => listener(alert)) as ReadonlyArray<
        Observable<T> | undefined
      >;
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    hasListeners() {
      return listeners.size > 0;
    },
  };
}

export function getAlertBus(): MfAlertBus {
  return (globalThis.__TAIGA_MF_ALERT_BUS__ ??= createBus());
}
