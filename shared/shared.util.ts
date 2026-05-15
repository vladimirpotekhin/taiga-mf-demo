import { SharedLibraryConfig } from '@nx/module-federation';

export function makeSharedConfig(
  requiredVersion: string,
  singleton = true
): SharedLibraryConfig {
  return {
    singleton,
    strictVersion: false,
    requiredVersion,
  };
}

export function makePackageAndPrefixShared(
  packageName: string,
  requiredVersion: string,
  singleton = true
): [string, SharedLibraryConfig][] {
  const config = makeSharedConfig(requiredVersion, singleton);

  return [
    [packageName, config],
    [`${packageName}/`, config],
  ];
}

export function excludeTaigaFromAutoShare(packageName: string): boolean {
  return (
    packageName.startsWith('@taiga-ui/')||
    packageName.startsWith('@ng-web-apis/')
  );
}
