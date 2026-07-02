import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TUI_VERSION } from '@taiga-ui/cdk/constants';
import {
  TuiAlertOptions,
  TuiAlertService,
  TuiButton,
  TuiRoot,
} from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { getAlertBus } from '../../../../../shared/alert-bus';
import { scopeContentToVersion } from '../../../../../shared/mf-version-scope';

@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    RouterLink,
    TuiRoot,
    TuiNavigation,
    TuiButton,
    RouterLinkActive,
  ],
  templateUrl: './app.html',
  styleUrl: './app.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  // Render alerts emitted by the remotes (any version) in this host's single
  // portal, so they stack instead of overlapping in per-remote containers. We
  // return the cold `open()` Observable without subscribing — the remote that
  // published subscribes to it, so its result (e.g. a `completeWith` value)
  // flows back into the remote's reactive chain.
  constructor() {
    const alerts = inject(TuiAlertService);
    const injector = inject(Injector);
    const unsubscribe = getAlertBus().subscribe(({ content, options, version }) => {
      const scoped =
        version && version !== TUI_VERSION
          ? scopeContentToVersion(content, version, injector)
          : content;

      return alerts.open(scoped, options as Partial<TuiAlertOptions>);
    });

    inject(DestroyRef).onDestroy(unsubscribe);
  }
}
