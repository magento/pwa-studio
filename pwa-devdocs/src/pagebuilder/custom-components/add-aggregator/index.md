---
title: Add aggregator
---

The purpose of the configuration aggregator (configAggregator) is pull properties from a content type and return them as a flat object of the properties to the Page Builder PWA framework. The framework (specifically the `<ContentTypeFactory />`) passes these properties to your component so you can assign them to your component's corresponding properties for rendering within a PWA Studio app.

![Aggregator Overview](AddAggregatorOverview.svg)

## Master Format HTML

The key to building out your aggregator is knowing the structure, content, and properties available in your content type's master format. You can do this the hard way by looking in the database of your Magento instance (that is, the `content` field in the `cms_page` and `cms_block` tables). But there is a better way.

**Protip**: Place a `console.log(node)` at the top of your `configAggregator` function so you can see exactly what your content type's HTML (the `HTMLElement` passed by the framework) looks like.

In our `ExampleQuote` component, the framework passes the following HTMLElement (color coded here for easier analysis) to our aggregator:

![Master format HTML](MasterFormatHTML.svg)

## The Aggregator

The interface for a `configAggregator` is as follows:

```ts
(node: HTMLElement, props: {contentType: string, appearance: string}) => {[key: string]: any}
```

### Purpose

The purpose of your component's aggregator is to collect (aggregate) properties from your content type's HTML and return a property object for use in your component. The object you return should contain all the text, html, inline styles, and classes you need to faithfully reproduce your content type as a component in PWA Studio.

For example, after analyzing the master format HTML for our Quote content type, we decide to retrieve and return the following properties to our component:

-   Inline **styles** from the first node
-   CSS **classes** from the first child node
-   **Text** content from the first two child nodes
-   **HTML** content from the last child node

To do this, you'll want to use a combination of [HTMLElement DOM properties] along with our [utility functions], as shown in the following example.

### Example

Here is the aggregator we use for the `ExampleQuote` component:

```js
import { getAdvanced } from '../../utils';

export default (node, props) => {

console.log(node);

    return {
        quote: node.childNodes[0].textContent,
        author: node.childNodes[1].textContent,
        description: node.childNodes[2].innerHTML,
        ...getAdvanced(node)
    };
};
```

First we `import` the utility function(s) we want to use. In our case, we know that our Quote content type provides end users with the Advanced form section. So we import the `getAdvanced` function from `utils.js`.

Then we use the `element` names from the master format (color coded in green above) as our property key names: `quote`, `author`, and `description`. Doing this helps to identify where the data in the component comes from.

Next, we use the `textContent` and `innerHTML` DOM properties to grab the text and html values from the appropriate `childNodes`.

Finally, we use the `getAdvanced()` utility function to retrieve all the properties from the Advanced section of our content type's form. Later you will create the corresponding keys to capture these values within your component.

{: .bs-callout .bs-callout-info}
The Quote content type also has a form section called Background (from the `pagebuilder_base_form_with_background_attributes` form). This section of the form allows end users to enter all kinds of background attributes, such as images, colors, positions and so on. If your custom content uses the Background section, you probably want to include the those attributes in your component using the `getBackgroundImages()` utility function. However, to keep things simple for our component, we decided not to pull these attributes from the HTML.

### Retrieving data from different Appearances

If your content type has different appearances, the master format HTML will also differ. To handle this we provide the appearance within the second `props` argument so that you can modify your queries in order to retrieve data from the correct node.

For our Quote content type, we only have one appearance (the default). However the Row content type has three appearances, so it uses a conditional based on the `props.appearance` value to determine the correct node to use, as shown here:

```js
// Targeting appearances in the Row aggregator

export default (node, props) => {
    // Determine which node holds the data for the appearance
    const dataNode =
        props.appearance === 'contained' ? node.childNodes[0] : node;
    return {
        minHeight: dataNode.style.minHeight ? dataNode.style.minHeight : null,
        ...
    };
```

## Test the aggregator

The best way to see the properties returned by your aggregator is using `console.log()`. For our quote aggregator, we can do something like this:

```js
import { getAdvanced, getCssClasses, getBackgroundImages } from '../../utils';

export default (node, props) => {
    console.log(node);

    const propObject = {
        quote: node.childNodes[0].textContent,
        author: node.childNodes[1].textContent,
        description: node.childNodes[2].innerHTML,
        ...getAdvanced(node)
    };

    console.log(propObject);
    return propObject;
};
```

{: .bs-callout .bs-callout-info}
You will need to know the property `key-values` you are returning so that that you can assign them within your component.

[utility functions]: {{ site.baseurl }}{% link pagebuilder/utility-functions/index.md %}
[HTMLElement DOM properties]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
