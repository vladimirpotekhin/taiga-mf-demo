import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

export default async function (wco: any) {
  const mfConfig = await withModuleFederation(config, { dts: false });
  const result = await mfConfig(wco);

  result.output = { ...result.output, publicPath: '/' };

  return result;
}
