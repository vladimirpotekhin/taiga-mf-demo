import { ModuleFederationConfig } from '@nx/module-federation';
import {
  taiga5AdditionalShared,
} from '../../../shared/taiga5.shared';
import { excludeTaigaFromAutoShare } from '../../../shared/shared.util';

const config: ModuleFederationConfig = {
  name: 'remoteV5',
  exposes: {
    './Module': 'apps/remotes/remoteV5/src/app/remote-entry/entry-module.ts',
  },
  shared: (packageName, defaultConfig) => {
    if (excludeTaigaFromAutoShare(packageName)) {
      return false;
    }

    return defaultConfig;
  },

  additionalShared: [...taiga5AdditionalShared],
  disableNxRuntimeLibraryControlPlugin: true,
};

export default config;
