import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  TuiAlertOptions,
  TuiAlertService,
  TuiButton,
  TuiRoot,
} from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { getAlertBus } from '../../../../../shared/alert-bus';

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
    const unsubscribe = getAlertBus().subscribe(({ content, options }) =>
      alerts.open(content, options as Partial<TuiAlertOptions>)
    );

    inject(DestroyRef).onDestroy(unsubscribe);
  }
}
