---
title: Items
---

The `Items` component uses content in a data object to render a list of [`Item`] components.

It follows the [Fragments] pattern and returns its children without a wrapping element.
This allows you to decide how you want to wrap your list of items.

The `Items` component is used as a direct child of the [`List`] component.

## Props

| Name             | Required                                      | Description                                                         |
| ---------------- | :-------------------------------------------: | ------------------------------------------------------------------- |
| `items`          | <i class="material-icons green">check_box</i> | An iterable that yields `[key, item]` pairs such as an ES2015 [Map] |
| `renderItem`     |                                               | A [render prop] or HTML tagname string.                             |
| `selectionModel` |                                               | A string corresponding to a selection model.                        |
{:style="table-layout:auto"}

### Selection models

{% include peregrine/reference/list-selection-models.md %}

## Example

``` jsx
import Items from '@magento/peregrine';

const data = {
    s: { id: 's', value: 'Small' },
    m: { id: 'm', value: 'Medium' },
    l: { id: 'l', value: 'Large' }
};

<Items
    items={Object.entries(data)}
    renderItem='option'
    selectionModel='check'
/>
```

[`List`]: {{ site.baseurl }}{% link peregrine/reference/list/index.md %}
[render prop]: https://reactjs.org/docs/render-props.html
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[Fragments]: https://reactjs.org/docs/fragments.html
[`Item`]: {{ site.baseurl }}{% link peregrine/reference/item/index.md %}