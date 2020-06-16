---
title: Wrappable Peregrine Talons
---
<!-- TODO: Remove the following note after this feature is released in an official version -->

{: .bs-callout .bs-callout-info}
These wrappable talons are currently only available in the `develop` branch of the PWA Studio project.

This page lists the wrappable talons available through the [Talon wrapper configuration object][].
This object is available to callbacks passed to the `tap()` function of Peregrine's `talons` target.

```js
// Module: @my-extensions/log-wrapper

module.exports =  function wrapUseApp(original) {
    return function useApp(...args) {
      console.log('calling useApp with', ...args);
      return original(...args);
    }
```

```js
// A storefront project's intercept file

module.exports = targets => {
    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;

    talonsTarget.tap(talonWrapperConfig => {
        talonWrapperConfig.App.useApp.wrapWith('@my-extensions/log-wrapper');
    });
};
 ```

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/targets/peregrine-intercept.md %}

[talon wrapper configuration object]: #talonwrapperconfig