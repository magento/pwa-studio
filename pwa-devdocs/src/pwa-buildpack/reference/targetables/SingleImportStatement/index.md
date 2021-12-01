---
title: SingleImportStatement
adobeio: /api/buildpack/targetables/SingleImportStatement/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/pwa-buildpack/lib/WebpackTools/targetables/SingleImportStatement.md %}

## Examples

Code examples for using the `SingleImportStatement` class.

### Create a `SingleImportStatement` object

Pass in an import statement to the constructor to create a new `SingleImportStatement` object.

```js
const queryHookImport = new SingleImportStatement("import { useQuery } from '@apollo/react-hooks'");
```

This creates an object with the following properties:

```js
{
  statement: "import { useQuery } from '@apollo/react-hooks'",
  binding: 'useQuery',
  imported: 'useQuery'
}
```

### Change the binding

Use the `changeBinding()` function to rename the variable bound to the imported object.

```js
const queryHookImport = new SingleImportStatement("import { useQuery } from '@apollo/react-hooks'");

const queryHookImport2 = useQueryImport.changeBinding('useQuery2');
```

This creates an object with the following properties:

```js
{
  statement: "import { useQuery as useQuery2 } from '@apollo/react-hooks'",
  binding: 'useQuery2',
  imported: 'useQuery'
}
```

### Using the `SingleImportStatement` object

The `toString()` value of a `SingleImportStatement` object is the value of the `binding` property.
Use this to reference the component's local name when adding custom code with Targetables.

```jsx
// You can skip 'import' and the class is able to understand what you mean
let Button = new SingleImportStatement("Button from './button'");

// later, you learn there is a conflict with the `Button` identifier,
// so you generate a unique identifier
Button = Button.changeBinding(generateUniqueIdentifier());

// this renders the new identifier for your Button import in the final code
const jsx = `<${Button}>hello world</${Button}>`
```
