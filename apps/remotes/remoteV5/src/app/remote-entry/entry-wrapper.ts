import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import {
  provideTaiga,
  TUI_LIQUID_GLASS,
  TUI_OPTIONS,
  TuiNotificationService,
} from '@taiga-ui/core';
import { tuiIconResolverProvider } from '@taiga-ui/core/tokens';
import { RemoteEntryInner } from './entry';
import { provideTaigaMf } from './taiga-mf.providers';

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
      {
        provide: TUI_LIQUID_GLASS,
        useFactory: () => {
          const { apis } = inject(TUI_OPTIONS);
          return apis !== 'stable' && (apis.all || !!apis.liquidGlass);
        },
      },
      // Alerts are created with the injector that instantiated the service,
      // so scope the service here for them to pick up the icon resolver above.
      TuiNotificationService,
      // Route alerts to the host's portal (with a local fallback). Scoped here
      // so the fallback path still picks up the icon resolver above.
      ...provideTaigaMf(),
    ],
    inject(EnvironmentInjector),
  );
}
