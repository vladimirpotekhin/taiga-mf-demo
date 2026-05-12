import { SharedLibraryConfig } from '@nx/module-federation';
import { makePackageAndPrefixShared } from './shared.util';

const TAIGA_V4_PACKAGES = [
  '@taiga-ui/cdk',
  '@taiga-ui/core',
  '@taiga-ui/kit',
  '@taiga-ui/addon-charts',
  '@taiga-ui/addon-commerce',
  '@taiga-ui/addon-doc',
  '@taiga-ui/addon-editor',
  '@taiga-ui/addon-mobile',
  '@taiga-ui/addon-table',
] as const;

const UTILITY_PACKAGES = [
  '@taiga-ui/event-plugins',
  '@ng-web-apis/common',
  '@ng-web-apis/mutation-observer',
  '@ng-web-apis/platform',
  '@ng-web-apis/resize-observer',
  '@ng-web-apis/screen-orientation',
] as const;

export const taiga4AdditionalShared: [string, SharedLibraryConfig][] = [
  ...TAIGA_V4_PACKAGES.flatMap((pkg) =>
    makePackageAndPrefixShared(pkg, '^4.0.0', false)
  ),
  ...UTILITY_PACKAGES.flatMap((pkg) =>
    makePackageAndPrefixShared(pkg, '^4.0.0', false)
  ),
];
