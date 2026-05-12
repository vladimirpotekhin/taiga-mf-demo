import { ModuleFederationConfig } from '@nx/module-federation';
import {
  taiga4AdditionalShared,
} from '../../../shared/taiga4.shared';
import { excludeTaigaFromAutoShare } from '../../../shared/shared.util';

const config: ModuleFederationConfig = {
  name: 'host-v4',
  remotes: ['remoteV4', 'remoteV5'],
  shared: (packageName, defaultConfig) => {
    if (excludeTaigaFromAutoShare(packageName)) {
      return false;
    }

    return defaultConfig;
  },

  additionalShared: [...taiga4AdditionalShared],
  disableNxRuntimeLibraryControlPlugin: true,
};

export default config;
