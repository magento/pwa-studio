---
title: List
---

<!-- 
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->
{% include auto-generated/peregrine/src/List/list.md %}

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
