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

/**
 * Share a package as a single instance across *incompatible* semver majors.
 *
 * `requiredVersion: false` disables the federation runtime's version check, so
 * every app consumes the one instance already in the share scope instead of
 * falling back to its own bundled copy. Use this only for packages whose public
 * API is identical across majors (e.g. `@taiga-ui/polymorpheus`, kept aligned on
 * purpose) — otherwise a v4 consumer could be handed a v5 build it can't use.
 *
 * Without it, v4 apps (`^4`) and v5 apps (`^5`) never unify on one
 * `POLYMORPHEUS_CONTEXT` / `PolymorpheusComponent`, so component-type alert and
 * dialog content created in one major renders as `[object Object]` in the other.
 */
export function makeCrossMajorSingletonShared(
  packageName: string
): [string, SharedLibraryConfig][] {
  const config: SharedLibraryConfig = {
    singleton: true,
    strictVersion: false,
    requiredVersion: false,
  };

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
