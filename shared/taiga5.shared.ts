import { SharedLibraryConfig } from '@nx/module-federation';
import {
  makeCrossMajorSingletonShared,
  makePackageAndPrefixShared,
} from './shared.util';

const TAIGA_V5_PACKAGES = [
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
  '@ng-web-apis/common',
  '@ng-web-apis/mutation-observer',
  '@ng-web-apis/platform',
  '@ng-web-apis/resize-observer',
  '@ng-web-apis/screen-orientation',
] as const;

export const taiga5AdditionalShared: [string, SharedLibraryConfig][] = [
  ...TAIGA_V5_PACKAGES.flatMap((pkg) =>
    makePackageAndPrefixShared(pkg, '^5.5.0', false)
  ),
  ...UTILITY_PACKAGES.flatMap((pkg) =>
    makePackageAndPrefixShared(pkg, '^5.5.0', false)
  ),
  // Shared as one instance across v4/v5 so component-type alert & dialog content
  // keeps a single POLYMORPHEUS_CONTEXT / PolymorpheusComponent identity.
  ...makeCrossMajorSingletonShared('@taiga-ui/polymorpheus'),
  ...makePackageAndPrefixShared('@taiga-ui/event-plugins', '^5.0.0', true),
];
