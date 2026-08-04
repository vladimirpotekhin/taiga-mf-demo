import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
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
  `${__webpack_public_path__}assets/v4/icons/${icon
    .replace(/@[a-z]+\./i, '')
    .replaceAll('.', '/')}.svg`;

@Component({
  selector: 'app-remote-v4-entry',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="component; environmentInjector: envInjector" />`,
  styleUrls: ['./remote-theme.less'],
  encapsulation: ViewEncapsulation.None,
})
export class RemoteEntry {
  protected component = RemoteEntryInner;
  protected envInjector = createEnvironmentInjector(
    [
      provideEventPlugins(),
      tuiIconResolverProvider(iconResolver),
      // Route alerts to the host's portal, with a local fallback when standalone.
      ...provideTaigaMf(),
    ],
    inject(EnvironmentInjector),
  );
}
