---
title: Extensibility Targets
---

This page lists the extensibility targets declared in the Venia UI package.
Access these in your intercept files by specifying `@magento/venia-ui` from the TargetProvider object.

```js
/* my-custom-interceptors.js */

module.exports = targets => {
    const veniaTargets = targets.of('@magento/venia-ui')
}
```

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/venia-ui/lib/targets/venia-ui-declare.md %}
