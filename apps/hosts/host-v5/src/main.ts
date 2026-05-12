import('./bootstrap').catch((err) => console.error(err));

declare const __webpack_share_scopes__:
  | Record<string, Record<string, any>>
  | undefined;

setTimeout(() => {
  console.log('share scopes', __webpack_share_scopes__);

  console.log(
    'default scope keys',
    Object.keys(__webpack_share_scopes__?.['default'] ?? {})
  );

  console.log(
    'default @taiga-ui/core',
    __webpack_share_scopes__?.['default']?.['@taiga-ui/core']
  );
}, 3000);