---
title: Extensibility Targets
---
<!-- TODO: Remove the following note after this feature is released in an official version -->

{: .bs-callout .bs-callout-info}
These targets are currently only available in the `develop` branch of the PWA Studio project.

This page lists the extensibility targets declared in the Venia UI package.
Access these in your intercept files by specifying `@magento/venia-ui` from the TargetProvider object.

```js
/* my-custom-interceptors.js */

module.exports = targets => {
    const veniaTargets = targets.of('@magento/venia-ui')
}
```

See the [PWA Studio Target Experiments][] project repository for documented examples of extensions that use PWA Studio's extensibility framework.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/venia-ui/lib/targets/venia-ui-declare.md %}

[pwa studio target experiments]: https://github.com/magento-research/pwa-studio-target-experiments