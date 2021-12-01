---
title: TargetableESModuleArray
adobeio: /api/buildpack/targetables/TargetableESModuleArray/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/pwa-buildpack/lib/WebpackTools/targetables/TargetableESModuleArray.md %}

## Examples

Code examples for the `TargetableESModuleArray` class.

### Export PlainHtmlRenderer and PageBuilder in a list

This example uses the `TargetableESModuleArray` class to add `PageBuilder` and `PlainHtmlRenderer` to the array exported by the [`richContentRenderers.js` file][].

```js
// Create a TargetableESModuleArray linked to the richContentRenderers.js file
const renderers = targetable.esModuleArray('@magento/venia-ui/lib/components/RichContent/richContentRenderers.js');

// Push PageBuilder and PlainHtmlRenderer to the end of the array
renderers.push('import * as PageBuilder from "@magento/pagebuilder"');
renderers.push('import * as PlainHtmlRenderer from "@magento/venia-ui/lib/components/RichContent/plainHtmlRenderer"');
```

The file linked to the `TargetableESModuleArray` class must be a module that export an empty array.
Without the module, the loader has nothing to "load" and will not execute.
Code editors and linters may also complain if the module is missing.

After the transforms above, `richContentRenderers.js` enters the bundle as:

```js
import * as PageBuilder from '@magento/pagebuilder';
import * as PlainHtmlRenderer from '@magento/venia-ui/lib/components/RichContent/plainHtmlRenderer';

export default [
  PageBuilder,
  PlainHtmlRenderer
];
```

[`richcontentrenderers.js` file]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/RichContent/richContentRenderers.js
[export-esm-collection-loader]: https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/lib/WebpackTools/loaders/export-esm-collection-loader.js

