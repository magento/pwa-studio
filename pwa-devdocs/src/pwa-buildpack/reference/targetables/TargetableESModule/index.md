---
title: TargetableESModule
adobeio: /api/buildpack/targetables/TargetableESModule/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/pwa-buildpack/lib/WebpackTools/targetables/TargetableESModule.md %}

## Examples

Code examples for the `TargetableESModule` class.

### Add and use import statements

Calling the `addImport()` function returns a [`SingleImportStatement`][] object.
Use this object to refer to the component in your code.

```jsx
const logger = esModule.addImport('import logger from "./logger"');
esModule.insertAfterSource("./logger';\n", `${logger.binding}('startup')`)
```

The `SingleImportStatement` class overrides its `toString()` method to return the value of its `.binding` property,
so you can use the object itself in your templates

```jsx
const logger = esModule.addImport('import logger from "./logger"');
esModule.insertAfterSource("./logger';\n", `${logger}('startup')`)
```

#### Import statement limits

The `addImport()` function can only handle import statements with a single binding.

For example, the following code is allowed because it only binds `VeniaButton` in the statement:

```js
import { Button as VeniaButton } from '@magento/venia/lib/components/Button'
```

The following would not be allowed, since it adds two bindings (`VeniaButton` and `Carousel`):

```js
import { Button as VeniaButton, Carousel } from '@magento/venia'
```

#### Import conflicts

A conflict occcurs when an import statement uses a binding that already belongs to another existing import statement.
For example, you add the `logger` import statement in a previous example to a file that already imports another `logger` module.
When this happens, the `TargetableESModule` class rebinds the `logger` object to a different, unique name, such as `logger$$2`.

### Wrap a module

Use the `wrapWithFile()` function to wrap an exported module with another module from a specified file.

```js
// Create a TargetableESModule linked to the useProductFullDetail.js file
const useProductFullDetails = targetables.esModule(
    '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail.js'
);

// Wrap the `useProductFullDetail` named export from the file with
// the default export of `src/targets/wrapper.js` in the `myExtension` package.
useProductFullDetails.wrapWithFile(
    'useProductFullDetail',
    'myExtension/src/targets/wrapper'
);
```

[`singleimportstatement`]: <{%link pwa-buildpack/reference/targetables/SingleImportStatement/index.md %}>
