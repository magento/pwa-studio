---
title: Item
---


The `Item` component takes a data object and renders it using a [render prop] or wraps it in an HTML element. 

This component is used as a direct child of the [`Items`] fragment.

## Props

| Name         | Required                                      | Default | Description                                                   |
| ------------ | :-------------------------------------------: | ------- | ------------------------------------------------------------- |
| `classes`    |                                               | `{}`    | A classname hash                                              |
| `hasFocus`   |                                               | `false` | Set to `true` if the browser is currently focused on the item |
| `isSelected` |                                               | `false` | Set to `true` if the item is currently selected               |
| `item`       | <i class="material-icons green">check_box</i> |         | A data object. If this is a string, it is rendered as a child |
| `render`     | <i class="material-icons green">check_box</i> | `'div'` | A render prop or HTML tagname string, such as `"div"`.        |
{:style="table-layout:auto"}

## Example

``` jsx
{% raw %}
import Item from '@magento/peregrine';

<Item
    classes={{ root: 'foo' }}
    item={{ id: 's', value: 'Small' }}
    render='span'
/>
{% endraw %}
```

[render prop]: https://reactjs.org/docs/render-props.html
[`Items`]: {{ site.baseurl }}{% link peregrine/reference/items/index.md %}
[`List`]: {{ site.baseurl }}{% link peregrine/reference/list/index.md %}