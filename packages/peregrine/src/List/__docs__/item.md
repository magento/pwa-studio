# Item

The `Item` component is a direct child of the `Items` fragment.

## Usage

See `List`.

## Props

Prop Name | Required? | Description
--------- | :-------: | :----------
`classes` | ❌ | A classname object.
`hasFocus` | ❌ | Whether the element currently has browser focus
`isSelected` | ❌ | Whether the item is currently selected 
`item` | ✅ | A data object. If `item` is a string, it will be rendered as a child
`render` | ✅ | A [render prop](https://reactjs.org/docs/render-props.html). Also accepts a tagname (e.g., `"div"`)
