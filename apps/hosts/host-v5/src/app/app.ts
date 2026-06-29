import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  TuiButton,
  TuiNotificationService,
  type TuiNotificationOptions,
  TuiRoot,
} from '@taiga-ui/core';
import {
  TuiLogoComponent, TuiMainComponent,
  TuiNavigation,
} from '@taiga-ui/layout';
import { getAlertBus } from '../../../../../shared/alert-bus';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    TuiRoot,
    RouterLinkActive,
    TuiButton,
    TuiNavigation,
    TuiLogoComponent,
    TuiMainComponent,
    TuiButton,
  ],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  // Render alerts emitted by the remotes (any version) in this host's single
  // portal, so they stack instead of overlapping in per-remote containers. We
  // return the cold `open()` Observable without subscribing — the remote that
  // published subscribes to it, so its result (e.g. a `completeWith` value)
  // flows back into the remote's reactive chain.
  constructor() {
    const alerts = inject(TuiNotificationService);
    const unsubscribe = getAlertBus().subscribe(({ content, options }) =>
      alerts.open(content, options as Partial<TuiNotificationOptions>)
    );

    inject(DestroyRef).onDestroy(unsubscribe);
  }
}
