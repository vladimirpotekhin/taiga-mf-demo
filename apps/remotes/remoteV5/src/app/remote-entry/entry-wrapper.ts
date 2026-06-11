import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { provideTaiga, TuiNotificationService } from '@taiga-ui/core';
import { tuiIconResolverProvider } from '@taiga-ui/core/tokens';
import { RemoteEntryInner } from './entry';

// Resolve icons from this remote's own publicPath (its own taiga-ui version),
// even when mounted inside a host (e.g. the /both page). We provide the
// resolver itself (not just TUI_ASSETS_PATH) because TUI_ICON_RESOLVER's
// default factory runs at the root injector and would otherwise ignore a
// TUI_ASSETS_PATH override placed on this child injector.
declare const __webpack_public_path__: string;

const iconResolver = (icon: string): string =>
  `${__webpack_public_path__}assets/v5/icons/${icon
    .replace(/@[a-z]+\./i, '')
    .replaceAll('.', '/')}.svg`;

@Component({
  selector: 'app-remote-v5-entry',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="component; environmentInjector: envInjector" />`,
  styleUrls: ['./remote-theme.less'],
  encapsulation: ViewEncapsulation.None,
})
export class RemoteEntry {
  protected component = RemoteEntryInner;
  protected envInjector = createEnvironmentInjector(
    [
      provideTaiga(),
      tuiIconResolverProvider(iconResolver),
      // Alerts are created with the injector that instantiated the service,
      // so scope the service here for them to pick up the icon resolver above.
      TuiNotificationService,
    ],
    inject(EnvironmentInjector),
  );
}
