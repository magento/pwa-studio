---
title: TargetableESModuleObject
adobeio: /api/buildpack/targetables/TargetableESModuleObject/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/pwa-buildpack/lib/WebpackTools/targetables/TargetableESModuleObject.md %}

## Examples

Code examples for the `TargetableESModuleObject` class.

### Export three button styles in a mapping

Pass in import statements to the `add()` function to import that module into the target file and add it to the exported object.

```js
// Create a TargetableESModuleObject linked to the `button.js` file
const buttons = targetable.esModuleArray('path/to/buttons.js');

// Add import statements
buttons.add("import Primary from './path/to/Primary'");
buttons.add("import { Button as Simple } from './path/to/simple'");
buttons.add("import Secondary from './path/to/Standard'");
```

The file linked to the `TargetableESModuleObject` class must be a module that export an empty object.
Without the module, the loader has nothing to "load" and will not execute.
Code editors and linters may also complain if the module is missing.

After the transforms above, `./path/to/button.js` enters the bundle as:

```js
import Primary from './path/to/Primary');
import { Button as Simple } from './path/to/simple');
import { Secondary } from './path/to/Standard');

export default { Primary, Simple, Secondary };
```

[export-esm-collection-loader]: https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/lib/WebpackTools/loaders/export-esm-collection-loader.js