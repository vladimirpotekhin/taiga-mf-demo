import { ModuleFederationConfig } from '@nx/module-federation';
import {
  taiga5AdditionalShared,
} from '../../../shared/taiga5.shared';
import {
  excludeTaigaFromAutoShare,
  makeSharedConfig,
} from '../../../shared/shared.util';

const config: ModuleFederationConfig = {
  name: 'host-v5',
  remotes: ['remoteV4', 'remoteV5'],
  shared: (packageName, defaultConfig) => {
    if (excludeTaigaFromAutoShare(packageName)) {
      return false;
    }

    return defaultConfig;
  },

  additionalShared: [
    ['@angular/forms', makeSharedConfig('~21.1.0')],
    ...taiga5AdditionalShared,
  ],
  disableNxRuntimeLibraryControlPlugin: true,
};

export default config;
