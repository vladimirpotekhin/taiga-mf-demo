import { Home } from './home';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'remoteV4',
    loadChildren: () =>
      import('remoteV4/Module').then((m) => m.remoteRoutes),
  },
  {
    path: 'remoteV5',
    loadChildren: () =>
      import('remoteV5/Module').then((m) => m.remoteRoutes),
  },
  {
    path: 'both',
    loadComponent: () =>
      import('./both-remotes/both-remotes').then((m) => m.BothRemotes),
  },
  {
    path: '',
    component: Home,
  },
];
