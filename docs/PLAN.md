# Plan: Taiga UI Microfrontends — Multi-Version Compatibility Test

Test repository for exploring how different major versions of Taiga UI can coexist
on a single page when loaded through Module Federation.

## Goal

Taiga UI users who run a microfrontend architecture (Module Federation, Web Components)
hit real problems whenever two major versions of the library need to live on the same page.

This repository:
1. Reproduces typical scenarios that mix Taiga v4 and v5
2. Catalogues the issues that show up (CSS, DI, overlays, runtime)
3. Serves as a playground for building and testing adapters / plugins

## Layout

```
├── apps/
│   ├── hosts/
│   │   ├── host-v4/    # Host app (Taiga v4) — port 4200
│   │   └── host-v5/    # Host app (Taiga v5) — port 4300
│   └── remotes/
│       ├── remoteV4/   # Remote microfrontend (Taiga v4) — port 4201
│       └── remoteV5/   # Remote microfrontend (Taiga v5) — port 4202
```

Each host wires up both remotes via Module Federation.

## Test scenario matrix

| # | Host    | Remote A | Remote B | Description                          |
|---|---------|----------|----------|--------------------------------------|
| 1 | Taiga 4 | Taiga 4  | Taiga 5  | Typical gradual migration            |
| 2 | Taiga 5 | Taiga 4  | Taiga 5  | Host moved first, remote catching up |
| 3 | Taiga 5 | Taiga 4  | Taiga 4  | Host moved first                     |

## Phases

### Phase 1: Scaffolding and reproducing problems

- [x] Scaffold the Nx workspace with host/remote apps
- [x] Wire up Module Federation (both remotes mounted in both hosts)
- [x] Stub pages with visual version markers
- [x] Install Taiga UI v4 into host-v4 and remoteV4
- [x] Install Taiga UI v5 into host-v5 and remoteV5
- [x] Add the test components:
  - Forms (input, select, datepicker)
  - Overlay components (dialog, dropdown, hint)
  - Components that rely on global styles (theme)
- [ ] Run every combination and document the issues that surface
- [ ] Classify issues: CSS / DI / overlay / runtime

### Phase 2: Isolation strategies

- [ ] **CSS isolation**
  - `ViewEncapsulation.ShadowDom` for remote components
  - Namespacing CSS variables (`--tui-v4-*` vs `--tui-v5-*`)
  - Scoped style loading through MF `exposes`
- [ ] **DI isolation**
  - Separate injector trees per remote
  - Audit conflicting Taiga tokens
  - Wrapper module with an isolated `EnvironmentInjector`
- [ ] **Overlay / portal isolation**
  - Different containers for v4 and v5 overlays
  - `TuiDropdownService` vs CDK overlay conflicts
- [ ] **Module Federation configuration**
  - Taiga UI stays *out* of `shared` (each remote ships its own version)
  - Angular core lives in `shared` (`@angular/*`, `rxjs`)
  - Measure bundle size and load time

## Known expected problems

1. **CSS conflicts** — global styles and CSS variables that share the same name
2. **DI collisions** — injection tokens with identical keys, singleton services
3. **Overlay / portal conflicts** — anchoring on `document.body`, shared containers
4. **MF shared scope** — if Taiga lands in `shared`, webpack will try to force a single version
5. **Angular versions** — Taiga v4 and v5 may pin to different Angular majors
