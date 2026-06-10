import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { appRoutes } from './app.routes';
import { provideTaiga } from '@taiga-ui/core';
import { tuiAssetsPathProvider } from '@taiga-ui/core/tokens';

// Resolve icons from this host's own publicPath (its own taiga-ui version).
declare const __webpack_public_path__: string;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideEventPlugins(),
    provideTaiga(),
    tuiAssetsPathProvider(`${__webpack_public_path__}assets/v5/icons`),
  ],
};
