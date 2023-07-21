---
title: Peregrine Extensibility Targets
adobeio: /api/peregrine/targets/
---

This page lists the Targets declared in the Peregrine package.
Access these in your intercept files by calling `targets.of('@magento/peregrine')` on the TargetProvider object.

```js
/* my-custom-interceptors.js */
module.exports = targets => {
    const peregrineTargets = targets.of('@magento/peregrine')
}
```

See the [PWA Studio Target Experiments][] project repository for documented examples of extensions that use PWA Studio's extensibility framework.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/targets/peregrine-declare.md %}

[list of wrappable talons]: {%link peregrine/reference/targets/wrappable-talons/index.md %}

[pwa studio target experiments]: https://github.com/magento-research/pwa-studio-target-experiments
