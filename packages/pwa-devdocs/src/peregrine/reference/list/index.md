---
title: List
---

The `List` component maps a collection of data objects into an array of elements.
It also manages the selection and focus of those elements.

## Props

| Name                | Required                                      | Description                                                                                   |
| ------------------- | :-------------------------------------------: | --------------------------------------------------------------------------------------------- |
| `classes`           |                                               | A classname object                                                                            |
| `items`             | <i class="material-icons green">check_box</i> | An iterable that yields `[key, item]` pairs such as an ES2015 [Map]                           |
| `render`            | <i class="material-icons green">check_box</i> | A [render prop] for the list element. A tagname string, such as `"div"`, is also valid.       |
| `renderItem`        |                                               | A [render prop] for the list item elements. A tagname string, such as `"div"`, is also valid. |
| `onSelectionChange` |                                               | A callback that fires when the selection state changes.                                       |
| `selectionModel`    |                                               | A string corresponding to a selection model.                                                  |
{:style="table-layout:auto"}

### Selection models

{% include peregrine/reference/list-selection-models.md %}

## Example

``` jsx
{% raw %}
import { List } from '@magento/peregrine';

const simpleData = new Map()
    .set('s', 'Small')
    .set('m', 'Medium')
    .set('l', 'Large')

<List
    classes={{ root: 'foo' }}
    items={simpleData}
    render={'ul'}
    renderItem={'li'}
/>

const complexData = new Map()
    .set('s', { id: 's', value: 'Small' })
    .set('m', { id: 'm', value: 'Medium' })
    .set('l', { id: 'l', value: 'Large' })

<List
    classes={{ root: 'bar' }}
    items={complexData}
    render={props => (<ul>{props.children}</ul>)}
    renderItem={props => (<li>{props.value}</li>)}
/>
{% endraw %}
```

[render prop]: https://reactjs.org/docs/render-props.html
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map