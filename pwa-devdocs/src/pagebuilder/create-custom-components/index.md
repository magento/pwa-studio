---
title: Create custom components
---

We utilise a special [master format parser](master-format-parser.md) within our Page Builder integration to easily decompose data within the master format for use in a PWA Studio React component.

## Prerequisites

- Have PWA Studio setup and running in your development environment.
- Have a working Page Builder component, with the master format implemented.
- Be able to render and visualize your content type on the existing Luma store front.

## Structure

As we require some additional steps compared to a normal we have some additional files associated with each content type, in example our `Text` content types component structure looks like the following:

- `packages/venia-ui/lib/components/RichContent/PageBuilder/ContentTypes/Text`
  - `__tests__`
  - `configAggregator.js`
  - `index.js`
  - `text.css`
  - `text.js`

`__tests__` & `index.js` are just part of PWA Studio, and won't be discussed here.

### `configAggregator.js`

The config aggregator provides an interface which accepts the HTML master format for a specific content type, decomposes it and returns an flat object of the properties associated with the content type.

The interface for a `configAggregator` is as follows:

```ts
(node: HTMLElement, props: {contentType: string, appearance: string}) => {[key: string]: any}
```

We aim to have human friendly output from the config aggregator where we can as the keys will align with your content types component later on.

We provide a number of utility methods which help with retrieving commonly stored data, such as the advanced section and background images. These are all located within `packages/venia-ui/lib/components/RichContent/PageBuilder/utils.js`. We provide the following utilities, which all accept the `node` passed to the config aggregator:

- `getBackgroundImages`
- `getVerticalAlignment`
- `getAdvanced` _If all advanced items are on the same node you can utilise our wrapper function, otherwise you'll want to use the below individual methods on the correct nodes_.
  - `getPadding`
  - `getMargin`
  - `getBorder`
  - `getTextAlign`
  - `getCssClasses`

For instance our Text content type aggregator looks like the following:

```js
import { getAdvanced } from '../../utils';

export default node => {
    return {
        content: node.innerHTML,
        ...getAdvanced(node)
    };
};
```

The only piece of data the Text content type implements in the admin, apart from our advanced section, is a content field. We utilise DOM functions such as `innerHTML` to retrieve the data from the format and return it. We aim to use the field names from the Page Builder admin form for the keys within the config aggregators response to easily identify which piece of data is which within the component.

**Tip:** I find placing a `console.log(node)` at the top of the configAggregator while development can help identify where aspects of the data lives within the master format.

### Appearances

Some content types have different appearances and thus differences in their master format output, this occurs already within our core Row content type. To handle this we provide the appearance within the second props argument to allow you to modify your queries to retrieve the data from the current node.

For instance in Row we swap the main node we detect upon based on the appearance:

```js
export default (node, props) => {
    // Determine which node holds the data for the appearance
    const dataNode =
        props.appearance === 'contained' ? node.childNodes[0] : node;
```

### `text.css`

This contains our content types styling, the experience within Page Builder is the same as creating a component elsewhere in PWA Studio.

### `text.js`

Our React component is once again, the same as working with a normal React component in PWA Studio. However, the way the component is rendered through Page Builder's factory makes the props provided defined by the response of your config aggregator.

This results in having a larger number of props, which may all not be used when the component is initialized. Due to this you need to ensure if a value is null the component can still render correctly.

```js
const Text = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        content,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;
```

## Config

We currently maintain a static config object which dictates which content types are supported. To include support for your new content type you'll need to add an entry to `packages/venia-ui/lib/components/RichContent/PageBuilder/config.js`.

Each entry has to define it's `configAggregator` & `component`. Here's an example of the Text content types entry within this configuration:

```js
export const contentTypesConfig = {
    ...
    text: {
        configAggregator: textConfigAggregator,
        component: Text
    },
    ...
};
```

### Lazy components

As we're building a PWA performance is key, due to that we recommend loading less critical components via `React.lazy`. This will result in a very slight delay in that content rendering but will ensure we don't bloat the bundle size for the store.

We opt to use this for the following content types by default: Tabs, Tab Item, Buttons, Button Item, Block, Products, HTML & Divider.

To have your component loaded lazily you simply have to wrap your `component` reference in a `React.lazy` call as follows:

```js
export const contentTypesConfig = {
    ...
    products: {
        configAggregator: productsConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Products'))
    },
    ...
};
```

## Debugging

If you haven't yet modified the config object and setup the references you'll see the following console warning in your console to inform you the component is missing:

```text
parseStorageHtml.js?4091:67 No config aggregator defined for content type X, this content type won't be rendered.
```

If you have modified the configuration and your content type is still not displaying you can debug through `packages/venia-ui/lib/components/RichContent/PageBuilder/parseStorageHtml.js` to determine if your configuration item is being correctly detected.
