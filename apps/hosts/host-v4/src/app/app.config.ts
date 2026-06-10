import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { tuiAssetsPathProvider } from '@taiga-ui/core/tokens';
import { appRoutes } from './app.routes';

// Resolve icons from this host's own publicPath (its own taiga-ui version).
declare const __webpack_public_path__: string;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(appRoutes),
    provideEventPlugins(),
    tuiAssetsPathProvider(`${__webpack_public_path__}assets/v4/icons`),
  ],
};
