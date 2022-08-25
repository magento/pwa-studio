---
title: Wrappable Peregrine Talons
adobeio: /api/peregrine/targets/
---

## Usage

An extension may need to modify or decorate the behavior of a Peregrine talon.
For example, third-party code may need to log to an external source when certain events occur or it may need to extend the model returned by the talon when a component calls it.
To do this, you can wrap Peregrine talons to extend their functionality.

### Wrapper modules

Talons are React hooks, and React hooks are plain functions.
Therefore, you can use the function wrapper pattern to intercept talon functions.

The `talon.wrapWith(module)` method is similar to the [interceptor pattern](https://devdocs.magento.com/guides/v2.4/extension-dev-guide/plugins.html) used in Magento backend plugins.
During the build process, the extensibility framework dynamically wraps a talon implementation with code from a wrapper module by passing the talon function through the wrapper module before exporting it.

### Requirements

Wrapper modules for Peregrine talons must:

- be implemented in a separate file from the build-time Target code
- be accessible in frontend code via an `import`
- be a valid ES Module
- export one default function that implements the target talon's interface, i.e. it receives the original talon function as its parameter and must return a new talon function with the same function interface

Extensions which use wrapper modules _must_ also intercept the [Buildpack `specialFeatures` target]({%link pwa-buildpack/reference/targets/index.md %}#module_BuiltinTargets.specialFeatures) and set the feature flag `esModule: true`.

### Example

```js
/* @my-extension/log-wrapper/intercept.js */

module.exports = targets => {
    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;

    talonsTarget.tap(talonWrapperConfig => {
        talonWrapperConfig.App.useApp.wrapWith('@my-extensions/log-wrapper');
    });
};
 ```

```js
/* Module: @my-extensions/log-wrapper */

module.exports = function wrapUseApp(original) {
    return function useApp(...args) {
      console.log('calling useApp with', ...args);
      return original(...args);
    }
```

In the running PWA, the `wrapUseApp` function will run only once, on application load, at the time that `useApp` is first called.
From that point on, this code will log arguments to the developer console every time `useApp` is called.

See the [PWA Studio Target Experiments][] project repository for other documented examples of extensions that use PWA Studio's extensibility framework.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

[talon wrapper configuration object]: #talonwrapperconfig
[pwa studio target experiments]: https://github.com/magento-research/pwa-studio-target-experiments
