import { Component, DestroyRef, inject, Injector } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TUI_VERSION } from '@taiga-ui/cdk/constants';
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
import { scopeContentToVersion } from '../../../../../shared/mf-version-scope';

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
    const injector = inject(Injector);
    const unsubscribe = getAlertBus().subscribe(({ content, options, version }) => {
      // Content authored against another Taiga major renders in this host's
      // tui-root, so it would inherit this host's `data-tui-version`. Re-stamp
      // the source version around it so that major's scoped styles/theme match.
      const scoped =
        version && version !== TUI_VERSION
          ? scopeContentToVersion(content, version, injector)
          : content;

      return alerts.open(scoped, options as Partial<TuiNotificationOptions>);
    });

    inject(DestroyRef).onDestroy(unsubscribe);
  }
}
