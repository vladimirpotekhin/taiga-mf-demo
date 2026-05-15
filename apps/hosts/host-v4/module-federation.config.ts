import { ModuleFederationConfig } from '@nx/module-federation';
import {
  taiga4AdditionalShared,
} from '../../../shared/taiga4.shared';
import {
  excludeTaigaFromAutoShare,
  makeSharedConfig,
} from '../../../shared/shared.util';

const config: ModuleFederationConfig = {
  name: 'host-v4',
  remotes: ['remoteV4', 'remoteV5'],
  shared: (packageName, defaultConfig) => {
    if (excludeTaigaFromAutoShare(packageName)) {
      return false;
    }

    return defaultConfig;
  },

  additionalShared: [
    ['@angular/forms', makeSharedConfig('~21.1.0')],
    ...taiga4AdditionalShared,
  ],
  disableNxRuntimeLibraryControlPlugin: true,
};

export default config;
