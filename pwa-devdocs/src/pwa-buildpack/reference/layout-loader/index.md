---
title: magento-layout-loader
---

{: .bs-callout .bs-callout-warning}
**Warning:** This is a very early implementation. This API should be considered unstable.


The `magento-layout-loader` is a [webpack loader] that transforms [JSX] during compilation.
It gives Magento modules and extensions the ability to inject or remove content blocks in a layout without modifying the source files.

## Properties

| Name              | Description                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `operation`       | One of the supported types of operations.                                                 |
| `targetContainer` | The `data-mid` value of the `Container` to target.                                        |
| `targetChild`     | The `id` value of the [`ContainerChild`] to target within `targetContainer`.              |
| `componentPath`   | An absolute path pointing to a file containing a React component as the `default` export. |

## Supported operations

The following `operation` configuration values are supported:

* `removeContainer` - removes a specific `Container`
* `removeChild` - removes a specific `ContainerChild` in a specific `Container`
* `insertBefore` - inserts a component before a specific `ContainerChild` in a `Container`
* `insertAfter` - inserts a component after a specific `ContainerChild` in a `Container`

## Examples

### `removeContainer`

**Example configuration:**

``` json
{
    "operation": "removeContainer",
    "targetContainer": "any.container.id"
}
```

**Affected code:**
``` jsx
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

### `removeChild`

**Example configuration:**

``` json
{
    "operation": "removeChild",
    "targetContainer": "any.container.id",
    "targetChild": "container.child.id"
}
```

**Affected code:**
``` jsx
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

### `insertBefore`

**Example configuration:**

``` json
{
    "operation": "insertBefore",
    "targetContainer": "any.container.id",
    "targetChild": "container.child.id",
    "componentPath": "/Absolute/path/to/a/component.js"
}
```

**Affected code:**
``` jsx
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

### `insertAfter`

**Example configuration:**
``` json
{
    "operation": "insertAfter",
    "targetContainer": "any.container.id",
    "targetChild": "container.child.id",
    "componentPath": "/Absolute/path/to/a/component.js"
}
```

**Affected code:**
``` jsx
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

[webpack loader]: https://webpack.js.org/concepts/loaders/
[JSX]: https://reactjs.org/docs/introducing-jsx.html
[`ContainerChild`]: {{ site.baseurl }}{% link peregrine/reference/container-child/index.md %}
