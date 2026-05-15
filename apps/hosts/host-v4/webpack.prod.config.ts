import { withModuleFederation } from '@nx/module-federation/angular';
import baseConfig from './module-federation.config';

const config = {
  ...baseConfig,
  remotes: [
    ['remoteV4', 'https://taiga-mf-remote-v4.web.app/'],
    ['remoteV5', 'https://taiga-mf-remote-v5.web.app/'],
  ] as [string, string][],
};

export default withModuleFederation(config, { dts: false });
