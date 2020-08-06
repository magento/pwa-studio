---
title: Wrappable Peregrine Talons
---

This page lists the wrappable talons available through the [Talon wrapper configuration object][].

## Usage

An extension may need to modify or decorate the behavior of a Peregrine talon.
Third-party code may need to log to an external source when certain events occur, or may need to extend the model returned by the talon when a component calls it.

### Wrapper modules

Talons are React hooks, and React hooks are plain functions.
Therefore, you can use the function wrapper pattern to intercept talon functions.

The `talon.wrapWith(module)` method is simlar to the [interceptor pattern](https://devdocs.magento.com/guides/v2.4/extension-dev-guide/plugins.html) also used in Magento backend plugins.
Peregrine will dynamically inject the code from the passed `module` "around" the implementation of a talon, by passing the talon function through the wrapper function before exporting it.

### Requirements

Wrapper modules for Peregrine talons must:
- be implemented in a separate file from the build-time Target code
- be accessible in frontend code via an `import`
- be a valid ES Module
- export one default function that implements the [TalonWrapper][] interface, i.e. it receives the original talon function as its parameter and must return a new talon function

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

{% include auto-generated/peregrine/lib/targets/TalonWrapperConfig.md %}

[talon wrapper configuration object]: #talonwrapperconfig
[pwa studio target experiments]: https://github.com/magento-research/pwa-studio-target-experiments
