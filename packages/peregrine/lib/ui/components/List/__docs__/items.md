# Items

The `Items` component is a direct child of the `List` component. As a fragment, it returns its children directly, with no wrapping element.

## Usage

See `List`.

## Props

Prop Name | Required? | Description
--------- | :-------: | :----------
`items` | ✅ | An iterable that yields `[key, item]` pairs, such as an ES2015 `Map`
`renderItem` | ❌ | A [render prop](https://reactjs.org/docs/render-props.html). Also accepts a tagname (e.g., `"div"`)
`selectionModel` | ❌ | A string specifying whether to use a `radio` or `checkbox` selection model
