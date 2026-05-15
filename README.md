# Taiga UI Microfrontends Playground

A sandbox for checking how **different major versions of Taiga UI coexist on a single page**
through Module Federation. Two host applications (on Taiga v4 and v5) load two remote
microfrontends (also on v4 and v5) in mixed combinations — so we can catch CSS, DI and
overlay-container conflicts before they reach production.

> Looking for the detailed research plan, phases and scenario matrix?
> See [docs/PLAN.md](./docs/PLAN.md).

## Demo

| App         | Stack                       | Link |
|-------------|-----------------------------|--------|
| Host v4     | Angular 21 + Taiga UI 4.81  | https://taiga-mf-host-v4.web.app |
| Host v5     | Angular 21 + Taiga UI 5.5   | https://taiga-mf-host-v5.web.app |
| Remote v4   | Angular 21 + Taiga UI 4.81  | https://taiga-mf-remote-v4.web.app |
| Remote v5   | Angular 21 + Taiga UI 5.5   | https://taiga-mf-remote-v5.web.app |

Routes available on each host:
- `/` — landing page with navigation
- `/remoteV4` — remote v4 only
- `/remoteV5` — remote v5 only
- `/both` — both remotes on the same page (the main conflict scenario)

## Stack

- **Nx 22** — monorepo, orchestration
- **Angular 21** — framework
- **@nx/module-federation** (Webpack 5 MF) — host ↔ remote wiring
- **Taiga UI** — `4.81` and `5.5` side by side
- **Firebase Hosting** — static deployment

## Layout

```
apps/
├── hosts/
│   ├── host-v4/      # Host on Taiga v4 — dev :4200
│   └── host-v5/      # Host on Taiga v5 — dev :4300
└── remotes/
    ├── remoteV4/     # Remote on Taiga v4 — dev :4201
    └── remoteV5/     # Remote on Taiga v5 — dev :4202

shared/               # Shared MF config (shared scope, Taiga exclusions)
```

Every host wires up **both** remotes, so all three test scenarios (host v4 with mixed remotes,
host v5 with mixed remotes) work without re-configuration.

## Running locally

```bash
npm install

# Host v4 + both remotes → http://localhost:4200
npm run start:host-v4

# Host v5 + both remotes → http://localhost:4300
npm run start:host-v5
```

The Nx Module Federation dev-server boots the remote apps automatically, no separate launch
needed. If you still want them in isolation: `npm run start:remote-v4` / `npm run start:remote-v5`.

## Building

```bash
npm run build:host-v4       # single project
npm run build:all           # every project at once via nx run-many
npm run lint:all
npm run graph               # Nx dependency graph
```

## Deployment (Firebase Hosting)

The Firebase project is `taiga-mf` with one site per app. Targets are declared in `.firebaserc`,
the serving rules live in `firebase.json` (including the CORS headers on `remoteEntry.js`
so a host on a different origin can pull it).

```bash
npx firebase login          # one-time

npm run deploy:host-v4      # build + deploy a single app
npm run deploy:host-v5
npm run deploy:remote-v4
npm run deploy:remote-v5

npm run deploy:all          # build everything + deploy all sites at once
```

## What this playground actually tests

The goal is to catch and document everything that breaks when versions are mixed:

- **CSS** — conflicts between global styles and CSS variables that share names
- **DI** — collisions between Taiga injection tokens and singleton services
- **Overlays / portals** — overlay containers anchored to `document.body`
- **MF shared scope** — what belongs in `shared` vs what must stay isolated
- **Angular peer-dependency versions** between Taiga v4 and v5

Details and current status live in [docs/PLAN.md](./docs/PLAN.md).

## License

MIT
