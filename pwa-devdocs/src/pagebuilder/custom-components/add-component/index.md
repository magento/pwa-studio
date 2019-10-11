---
title: Add component
---

Page Builder React components are the same as working with other React components in PWA Studio. However, the properties defined within a Page Builder component are determined by the properties returned from your configuration aggregator. This may result a larger number of props than usual. But not all props are used when the component is initialized. As a result, you need to ensure if a value is null the component can still render correctly. Here is an example of the properties defined in the `exampleQuote.js`.

## Build out your component

```js
const ExampleQuote = props => {
    const {
        quote,
        author,
        description,
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

