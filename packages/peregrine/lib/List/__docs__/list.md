# List

The `List` component maps a collection of data objects into an array of elements. It also manages the selection and focus of those elements.

## Usage

```jsx
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
    renderItem={props => (<li>{props.item.value}</li>)}
/>
```

## Props

Prop Name | Required? | Description
--------- | :-------: | :----------
`classes` | ❌ | A classname hash
`items` | ✅ | An iterable that yields `[key, item]` pairs, such as an ES2015 `Map`
`render` | ✅ | A [render prop](https://reactjs.org/docs/render-props.html) for the list element. Also accepts a tagname (e.g., `"div"`)
`renderItem` | ❌ | A [render prop](https://reactjs.org/docs/render-props.html) for the list item elements. Also accepts a tagname (e.g., `"div"`)
`onSelectionChange` | ❌ | A callback fired when the selection state changes
`selectionModel` | ❌ | A string specifying whether to use a `radio` or `checkbox` selection model
