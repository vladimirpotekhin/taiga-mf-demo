# Alert bus & component-content rendering across Module Federation

This document explains how alerts/notifications emitted by the remotes (Taiga v4
and v5) are shown in a single host portal, how the bus works, and — most
importantly — which DI tree and injectors are involved in rendering alert content
(including component content via Polymorpheus).

## TL;DR

- Each Taiga copy (host v4/v5, remoteV4, remoteV5) has its **own** `tui-root` and
  its **own** alert portal. On the `/both` page that yields several full-viewport
  overlays stacked at the same spot, visually overlapping.
- Fix: remotes don't open the alert themselves — they **publish it onto a bus**;
  the **host** opens it with its own `TuiAlertService` / `TuiNotificationService`
  in its single portal. Everything lines up correctly.
- The swap is transparent: remote components **keep injecting the stock Taiga
  service**. A `provideTaigaMf()` provider on the remote's entry injector replaces
  it under the hood.
- Content (string / `TemplateRef` / component) is **not serialized** — the bus
  lives in one JS heap on `globalThis`, so a live reference crosses the MF
  boundary.
- For **component content** (`PolymorpheusComponent`) to render across majors
  (a v5 component inside a v4 host), `@taiga-ui/polymorpheus` is shared as a
  **cross-major singleton** (`requiredVersion: false`).

## The problem

`TuiAlertService` (v5: `TuiNotificationService`) renders an alert into a container
that lives inside the `tui-root` of the same Taiga copy. "Nested `tui-root`"
detection goes through `inject(TuiRoot, { skipSelf })` — but between host and
remote these are **different copies** of Taiga (Taiga is deliberately out of the
MF shared scope, see `excludeTaigaFromAutoShare`), so the check never fires: every
`tui-root` thinks it is the root and draws its own container.

On `/both` you end up with:

- host-v5 → `<tui-popups>` (its own portal)
- remoteV5 → another `<tui-popups>`
- remoteV4 → `<tui-alerts>` (a different engine)

All three are `position: fixed`, full-viewport, in the same corner → they overlap.

On top of that, the v4 and v5 alert engines are **API-incompatible**:

| | v4 | v5 |
|---|---|---|
| Service | `TuiAlertService` extends `TuiPopoverService` | `TuiAlertService` extends `TuiPortal` → `TuiPopupService` |
| Channel | `TUI_ALERTS` (`BehaviorSubject` token) | `TuiPopupService` (portal) |
| Container component | `<tui-alerts>` | `<tui-popups>` |
| Notifications | `TuiAlertService` directly | separate `TuiNotificationService` |

There is no shared Taiga API both versions could write into — so communication
goes through a neutral bus.

## Bus architecture

File: `shared/alert-bus.ts`.

```
remoteV4 / remoteV5                         host (v4 or v5)
┌─────────────────────────┐                 ┌────────────────────────────┐
│ component injects        │                 │ App.constructor():         │
│ TuiAlertService          │                 │   bus.subscribe(listener)  │
│   (actually substituted) │                 │                            │
│         │ open()         │                 │  listener(payload):        │
│         ▼                │   publish()     │    return host.open(...)   │
│  bus.publish(payload) ───┼────────────────▶│      (cold Observable)     │
│         ▲                │                 │            │               │
│         └── Observable ◀─┼─────────────────┼────────────┘               │
└─────────────────────────┘   result         └────────────────────────────┘
```

### Why `globalThis`

Taiga is out of the shared scope, so every bundle (host, remoteV4, remoteV5)
ships its **own** copy of `alert-bus.ts`. If the bus instance were a plain module
singleton, each app would get its own independent bus — a remote's publications
would never reach the host.

So the instance is pinned to `globalThis` under the `__TAIGA_MF_ALERT_BUS__` key:

```ts
declare global {
  // eslint-disable-next-line no-var
  var __TAIGA_MF_ALERT_BUS__: MfAlertBus | undefined;   // typed global — no casts
}

export function getAlertBus(): MfAlertBus {
  return (globalThis.__TAIGA_MF_ALERT_BUS__ ??= createBus());   // created once, first caller wins
}
```

Whoever calls `getAlertBus()` first creates the instance; every other copy of the
module gets the same object. One process — one bus.

### Contract

```ts
interface MfAlertOptions<T = unknown> {
  readonly label?: PolymorpheusContent;
  readonly appearance?: string;
  readonly autoClose?: number | boolean;
  readonly icon?: PolymorpheusContent;
  readonly closeable?: boolean;
  readonly data?: T;                          // value for injectContext / completeWith
  readonly [option: string]: unknown;         // version-specific options pass straight through
}

interface MfAlertPayload<T = unknown> {
  readonly content: PolymorpheusContent;      // string | TemplateRef | PolymorpheusComponent | ...
  readonly options?: MfAlertOptions<T>;
  readonly source?: string;                   // 'remoteV4' | 'remoteV5' — for debugging
}

type MfAlertListener = (a: MfAlertPayload) => Observable<unknown> | void;

interface MfAlertBus {
  publish<T>(alert: MfAlertPayload<T>): ReadonlyArray<Observable<T> | undefined>;
  subscribe(listener: MfAlertListener): () => void;
  hasListeners(): boolean;                     // is a host listening?
}
```

### On typing

The bus is version-agnostic at **runtime** (zero dependencies, it coordinates
copies that live outside the shared scope), but that's no excuse to collapse into
`unknown`. So:

- `content` is typed via `PolymorpheusContent` from `@taiga-ui/polymorpheus` —
  an **`import type`**, erased at compile time, so the runtime stays
  dependency-free. The type is identical across the v4 (4.10) and v5 (5.0.1)
  copies, and the package itself is a guaranteed cross-major singleton, so this is
  the honest type of what actually flows through the bus.
- `MfAlertOptions<T>` describes the **stable subset** of options common to v4
  `TuiAlertOptions` and v5 `TuiNotificationOptions` (those concrete types live in
  `@taiga-ui/core`, differ across majors and are not shared — hence a structural
  type instead of importing either one). The index signature lets any
  version-specific option pass straight through to the host's `open()`.
- The generic `T` is threaded through `data` → `publish<T>` → `Observable<T>`, so
  `open<number>(...)` in a component keeps `Observable<number>` across the whole
  bus.

Note: **content is not serialized**. The bus is a plain in-process `Set` of
listeners; `publish` just calls them synchronously and passes the `payload` by
reference. So `content` is a live object (string, `TemplateRef`, component class)
crossing the MF boundary without JSON.

## Transparent service substitution

Files: `apps/remotes/remoteV{4,5}/src/app/remote-entry/taiga-mf.providers.ts`.

The goal is that **nothing changes on the remote side**: components keep injecting
`TuiAlertService` / `TuiNotificationService`. A single provider on the remote's
entry injector performs the swap.

### v5 — `useClass`

v5 `TuiNotificationService` is a plain `@Injectable({providedIn:'root'})` with a
parameterless constructor, so subclassing is trivial:

```ts
@Injectable()
export class TuiMfNotificationService extends TuiNotificationService {
  private readonly bus = getAlertBus();

  override open<G = void>(
    content: PolymorpheusContent,
    options: Partial<TuiNotificationOptions<G>> = {},
  ): Observable<G> {
    if (this.bus.hasListeners()) {
      const result = this.bus
        .publish<G>({ content, options: options as MfAlertOptions<G>, source: 'remoteV5' })
        .find(Boolean);                                // first listener that actually rendered
      return result ?? EMPTY;                          // see "reactive round-trip"
    }
    return super.open(content, options);               // fallback: remote running standalone
  }
}

export function provideTaigaMf(): Provider[] {
  return [{ provide: TuiNotificationService, useClass: TuiMfNotificationService }];
}
```

### v4 — `useFactory`

v4 `TuiAlertService` is built by a factory with explicit args (non-standard
`deps`), so the subclass is assembled the same way, by hand:

```ts
export class TuiMfAlertService extends TuiAlertService {
  private readonly bus = getAlertBus();
  override open(content, options = {}) { /* same logic, source: 'remoteV4' */ }
}

export function provideTaigaMf(): Provider[] {
  return [{
    provide: TuiAlertService,
    useFactory: () =>
      new TuiMfAlertService(TUI_ALERTS, TuiAlertComponent, inject(TUI_ALERT_OPTIONS)),
  }];
}
```

### Where it's provided

In each remote's `entry-wrapper.ts`, inside `createEnvironmentInjector(...)`:

```ts
protected envInjector = createEnvironmentInjector(
  [
    provideTaiga(),                       // v5 (v4 uses provideEventPlugins())
    tuiIconResolverProvider(iconResolver),
    ...provideTaigaMf(),                  // alert-service substitution
  ],
  inject(EnvironmentInjector),
);
```

`provideTaigaMf()` comes **after** `provideTaiga()`, so it overrides the stock
provider while the fallback path (`super.open()`) still sees the icon resolver and
the rest of the remote's wiring.

### Fallback

`hasListeners()` answers "is there a host rendering on our behalf?". If the remote
runs **standalone** (on its own port, without a host) there are no listeners — the
substituted service calls `super.open()` and the alert is shown by the remote's
native engine. Standalone behaviour is unchanged.

## Alert DI tree and injectors

This is the key part. Let's walk through who instantiates what, and in which
injector.

### Who opens vs who renders

```
┌── Remote EnvironmentInjector ───────────────────────────┐
│  TuiAlertService  ──provideTaigaMf()──▶ TuiMf*Service    │   ← remote component
│  (instance substituted)                   │ open()       │      calls open()
└───────────────────────────────────────────┼─────────────┘
                                             │ bus.publish
                                             ▼
┌── Host root injector / tui-root ────────────────────────┐
│  TuiAlertService (host)  .open(content, options)        │   ← actually opens
│        │                                                │
│        ▼                                                │
│  Host portal: <tui-popups> (v5) / <tui-alerts> (v4)     │   ← actually renders
│        │                                                │
│        ▼ creates the content view in THIS injector      │
│  POLYMORPHEUS_CONTEXT = { data, completeWith, ... }     │
└─────────────────────────────────────────────────────────┘
```

The crucial point: **the alert is instantiated by the HOST's injector**, because
`open()` ultimately calls the host service, which creates the container/portal in
its own `tui-root`. So the content's DI context is the host's, not the remote's.

### What this means for the different content types

| `content` type | Whose injector renders | Whose directives/pipes | Works across majors |
|---|---|---|---|
| `string` | host | — | ✅ always |
| `TemplateRef` | host (as embedded view) | **remote** (template's declaration injector) | ✅ (context is host's) |
| `PolymorpheusComponent` (class) | **host** | host | ✅ only with a shared polymorpheus singleton |

- **String** — trivial, renders anywhere.
- **`TemplateRef`** — an embedded view keeps its own *declaration injector*, so
  directives/pipes inside the template resolve against the **remote's** Taiga,
  where the template was declared. The context (`$implicit` / observer) is supplied
  by the host's Taiga. Within one major this is compatible.
- **Component content** is instantiated by the **host's injector** and its Taiga
  version. For `injectContext()` inside the component to find the context, you need
  the **same** `POLYMORPHEUS_CONTEXT` token and the **same** `PolymorpheusComponent`
  class on both sides of the boundary.

### Polymorpheus as a cross-major singleton

`injectContext()` reads the `POLYMORPHEUS_CONTEXT` token, and "this is component
content" is detected via `instanceof PolymorpheusComponent`. If host and remote
have **different physical copies** of `@taiga-ui/polymorpheus`, then:

- the `PolymorpheusComponent` classes don't match → `instanceof` is false → content
  is coerced to a string → the portal shows `[object Object]`;
- the `POLYMORPHEUS_CONTEXT` tokens differ → `injectContext()` finds no data.

The repo physically installs **two** polymorpheus versions (4.10.0 for v4, 5.0.1
for v5). Their API was deliberately aligned so a single instance can be used across
majors. To make the MF runtime actually collapse them into one instance,
polymorpheus is shared with the **version check disabled**:

```ts
// shared/shared.util.ts
export function makeCrossMajorSingletonShared(packageName: string) {
  const config = { singleton: true, strictVersion: false, requiredVersion: false };
  return [[packageName, config], [`${packageName}/`, config]];
}
```

```ts
// shared/taiga4.shared.ts and shared/taiga5.shared.ts
...makeCrossMajorSingletonShared('@taiga-ui/polymorpheus'),
```

`requiredVersion: false` removes the semver check that otherwise kept the disjoint
`^4` and `^5` ranges from unifying (even with `singleton: true`). Now all four apps
take **one** polymorpheus instance from the shared scope → a single
`PolymorpheusComponent` / `POLYMORPHEUS_CONTEXT` → a v5 component renders correctly
and stays interactive inside a v4 host.

> ⚠️ This trick is valid **only** for packages with an API identical across majors
> (like the deliberately-aligned polymorpheus). For an arbitrary package it would
> hand a v4 consumer a v5 build it cannot understand.

## Reactive round-trip (cold Observable)

Taiga's `open()` is **cold** — nothing happens without a subscription, and the
value (e.g. from `completeWith`) is delivered to the subscriber. For the
substitution to be truly transparent, this property must survive **through the
bus**.

So:

1. The host listener **returns** the cold `open()` Observable and **does not
   subscribe** itself:
   ```ts
   // host app.ts
   getAlertBus().subscribe(({ content, options }) =>
     alerts.open(content, options as Partial<TuiNotificationOptions>)   // ← no .subscribe()
   );
   ```
2. `publish()` collects every listener's result into an array.
3. The remote's substituted service returns the host's Observable to the caller.
   `find(Boolean)` takes the first listener that actually rendered (returned an
   Observable), so passive observers (returning `void`) never shadow the host,
   regardless of subscription order:
   ```ts
   const result = this.bus.publish({ content, options, source }).find(Boolean);
   return result ?? EMPTY;
   ```
4. The **remote's chain** does the subscribing (just like vanilla Taiga). The
   `completeWith` value flows back along the host's Observable into the remote's
   `switchMap`, and the next `open()` is published onto the bus again.

This fixes the breakage that happened with `return EMPTY` (the alert showed, but
the remote's reactive response never fired).

### Verification

On `/both` (host-v5) the `BalanceAlert` example (component content) after `Submit`
(`completeWith(247)`) produces two publications in the bus log:

```
1. { content: '[component]',         label: 'Your balance', source: 'remoteV5' }
2. { content: 'Got a value — 247',   label: 'Response',     source: 'remoteV5' }
```

The second publication is the response from the remote's `switchMap`, rendered by
the host. A full round-trip across the MF boundary.

## Files involved

| File | Role |
|---|---|
| `shared/alert-bus.ts` | the bus itself (globalThis singleton, contract) |
| `shared/shared.util.ts` | `makeCrossMajorSingletonShared()` |
| `shared/taiga4.shared.ts`, `shared/taiga5.shared.ts` | polymorpheus as a cross-major singleton |
| `apps/remotes/remoteV4/.../taiga-mf.providers.ts` | `TuiAlertService` substitution (useFactory) |
| `apps/remotes/remoteV5/.../taiga-mf.providers.ts` | `TuiNotificationService` substitution (useClass) |
| `apps/remotes/remoteV{4,5}/.../entry-wrapper.ts` | `provideTaigaMf()` on the entry injector |
| `apps/hosts/host-v4/src/app/app.ts`, `host-v5/.../app.ts` | host listener (renders in its own portal) |
| `apps/remotes/remoteV5/.../showcase/balance-alert.ts` | component-content example used for verification |

## Known limitations

- **`@taiga-ui/event-plugins`** still warns in the console (4.7.0 vs ^5). It does
  not affect content rendering; if needed it can be fixed with the same
  `makeCrossMajorSingletonShared`.
- Substitution transparency is bounded by the nature of the bus: interactive
  content "responds" through a subscription initiated by the remote, but is
  rendered by the host's injector. Keep this in mind for component content with
  particularly unusual DI dependencies.
```
