---
title: Peregrine Extensibility Targets
---
<!-- TODO: Remove the following note after this feature is released in an official version -->

{: .bs-callout .bs-callout-info}
These targets are currently only available in the `develop` branch of the PWA Studio project.

This page lists the extensibility targets declared in the Peregrine package.
Access these in your intercept files by specifying `@magento/peregine` from the TargetProvider object.

```js
/* my-custom-interceptors.js */
module.exports = targets => {
    const peregrineTargets = targets.of('@magento/peregrine')
}
```

See the [PWA Studio Target Experiments][] project repository for other documented examples of extensions that use PWA Studio's extensibility framework.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/targets/peregrine-declare.md %}

[list of wrappable talons]: {%link peregrine/reference/targets/wrappable-talons/index.md %}

[pwa studio target experiments]: https://github.com/magento-research/pwa-studio-target-experiments