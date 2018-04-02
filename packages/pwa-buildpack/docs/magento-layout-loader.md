# magento-layout-loader

_This is a very early implementation, and the API should be considered
unstable._

The `magento-layout-loader` is a [webpack
loader](https://webpack.js.org/concepts/loaders/) that transforms
[JSX](https://reactjs.org/docs/introducing-jsx.html) during compilation. It
gives Magento modules/extensions the ability to inject or remove content blocks
in a layout without modifying theme source files.

## Terminology

* **Container**: An HTML element that contains 0 or more ContainerChild
  components. It acts as the target for the magento-loader-layout operations.
* **ContainerChild**: Component exposed by
  [Peregrine](https://github.com/magento-research/peregrine/). Responsible for
  rendering content
* **Operation**: An action that can be taken on a `Container` or
  `ContainerChild`. Examples include `removeContainer`, `insertAfter`, etc.

## `Container` Details

A Container can be created by adding a `data-mid` prop to any DOM element
(`div`/`span`/etc) in any React component. There are a limited number of
restrictions with Containers to be aware of:

* The `data-mid` prop _must_ be a literal string value - it cannot be a dynamic
  value, or a variable reference
* The direct descendants of a Container can only be a single component type -
  `ContainerChild` from
  [Peregrine](https://github.com/magento-research/peregrine/)
* A Container _must_ be a DOM element - it cannot be a Composite Component

## `ContainerChild` Details

Import the `ContainerChild` component from `@magento/peregrine` to use it in
your extension/module:

```js
import { ContainerChild } from '@magento/peregrine';
```

See the
[`ContainerChild`](https://github.com/magento-research/peregrine/blob/master/docs/ContainerChild.md)
documentation for further details on usage.

## Supported Operations/Configurations

### Fields

| Config Name       |                                       Description                                        |
| ----------------- | :--------------------------------------------------------------------------------------: |
| `operation`       |                         One of the supported types of operations                         |
| `targetContainer` |                    The `data-mid` value of the `Container` to target                     |
| `targetChild`     |        The `id` value of the `ContainerChild` to target within `targetContainer`         |
| `componentPath`   | An absolute path pointing to a file containing a React component as the `default` export |

### Operations

#### removeContainer

##### Configuration

```js
{
    "operation": "removeContainer",
    "targetContainer": "any.container.id"
}
```

<details>
<summary>Example</summary>

##### Input

```js
import React from 'react';

function render() {
    return (
        <div className="wrapper">
            The div below will be removed
            <div data-mid="any.container.id" />
        </div>
    );
}
```

##### Output

```js
import React from 'react';

function render() {
    return <div className="wrapper">The div below will be removed</div>;
}
```

</details>

#### removeChild

##### Configuration

```js
{
    "operation": "removeChild",
    "targetContainer": "any.container.id",
    "targetChild": "container.child.id"
}
```

<details>
<summary>Example</summary>

##### Input

```js
import React from 'react';
import { ContainerChild } from '@magento/peregrine';

function render() {
    return (
        <div className="wrapper" data-mid="any.container.id">
            The container below will be removed
            <ContainerChild
                id="container.child.id"
                render={() => <div>This content will be removed</div>}
            />
        </div>
    );
}
```

##### Output

```js
import React from 'react';

function render() {
    return (
        <div className="wrapper" data-mid="any.container.id">
            The container below will be removed
        </div>
    );
}
```

</details>

#### insertBefore

##### Configuration

```js
{
    "operation": "insertBefore",
    "targetContainer": "any.container.id",
    "targetChild": "container.child.id",
    "componentPath": "/Absolute/path/to/a/component.js"
}
```

<details>
<summary>Example</summary>

##### Input

```js
import React from 'react';
import { ContainerChild } from '@magento/peregrine';

function render() {
    return (
        <div className="wrapper" data-mid="any.container.id">
            <ContainerChild
                id="container.child.id"
                render={() => <div>Some Content</div>}
            />
        </div>
    );
}
```

##### Output

```js
import React from 'react';
import { ContainerChild } from '@magento/peregrine';
import _Extension from '/Absolute/path/to/a/component.js';

function render() {
    return (
        <div className="wrapper" data-mid="any.container.id">
            <_Extension />
            <ContainerChild
                id="container.child.id"
                render={() => <div>Some Content</div>}
            />
        </div>
    );
}
```

</details>

#### insertAfter

##### Configuration

```js
{
    "operation": "insertAfter",
    "targetContainer": "any.container.id",
    "targetChild": "container.child.id",
    "componentPath": "/Absolute/path/to/a/component.js"
}
```

<details>
<summary>Example</summary>

##### Input

```js
import React from 'react';
import { ContainerChild } from '@magento/peregrine';

function render() {
    return (
        <div className="wrapper" data-mid="any.container.id">
            <ContainerChild
                id="container.child.id"
                render={() => <div>Some Content</div>}
            />
        </div>
    );
}
```

##### Output

```js
import React from 'react';
import { ContainerChild } from '@magento/peregrine';
import _Extension from '/Absolute/path/to/a/component.js';

function render() {
    return (
        <div className="wrapper" data-mid="any.container.id">
            <ContainerChild
                id="container.child.id"
                render={() => <div>Some Content</div>}
            />
            <_Extension />
        </div>
    );
}
```

</details>

## FAQ

### How are the configurations for individual extensions/modules collected and provided to the loader?

This functionality has not been completed yet. There is outstanding work to be
done in Magento 2 to collect and expose aggregated configuration from each
module.

### Why is a `Container` required to be a DOM Element?

There are many tools in the React ecosystem that attempt to prevent passing
unknown props to React components (`TypeScript`/`Flow`/`eslint`/etc). However,
`data-*` props are always allowed on DOM elements. By enforcing this
restriction, we can [prevent surprising
behavior](https://en.wikipedia.org/wiki/Principle_of_least_astonishment) when
copying and pasting code from examples into a theme or module/extension.
Compiling out these extra props would not mitigate the issue, as all the
aforementioned tools operate on source files.

### Why is a `ContainerChild` the only type of child allowed within a `Container`?

This restriction is necessary to support the [`insertBefore`](#insertbefore) and
[`insertAfter`](#insertafter) operations. Because a `ContainerChild` is required
to have a unique `id` prop, this ensures that there will never be an
untargetable child of a `Container`.
