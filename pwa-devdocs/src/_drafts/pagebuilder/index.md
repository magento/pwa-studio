---
title: Page Builder to PWA integration
---

{: .bs-callout-info}
The Page Builder integration to PWA Studio is only compatible with Magento Commerce 2.3.4+. A GraphQL change within Magento Commerce 2.3.4 was necessary in order to integrate the Page Builder Products content type into PWA Studio.

## Page Builder Integration: The Big Picture

At the highest level, the Page Builder integration into PWA Studio simply ensures that CMS Pages built in Magento Commerce with _native_ Page Builder content types are rendered correctly within PWA Studio apps.

The diagram below shows how the PWA Studio makes a request to the Magento Commerce backend to retrieve a CMS page for processing. The Page Builder integration framework processes the original Page Builder HTML and returns a group of React components that faithfully reproduces the Page Builder content for display in a PWA Studio app.

![Page Builder Integration Big Picture](images/PageBuilderBigPicture1.svg)

1. The Page Builder integration framework processes Page Builder content types within a CMS Page: Rows, Headings, Banners, Sliders, and so on.

2. A set of equivalent content type React components -- Row, Heading, Banner, Slider, Text and so on -- are populated with the content and style properties from the original Page Builder content types so they can be displayed correctly within PWA Studio app storefronts.

## Page Builder Integration: Custom Content Types

If you only used Page Builder's 15 native content types (Dynamic Blocks are not supported), your Page Builder pages are automatically rendered within a PWA Studio app. No development work is necessary. However, if you use one or more of your own custom Page Builder content types within your CMS pages (for example, a [Quote-Testimonial content type][]), you will need to create your own equivalent Page Builder React component and integrate it within the framework. Otherwise, your custom content type will not appear on the storefront within a PWA Studio app. That area of your page will simply be blank.

{: .bs-callout-info}
To develop and integrate your own custom content type components into your PWA Studio app, follow our [Creating custom components][] tutorial.

![Page Builder Integration Overview](images/PageBuilderIntegration.svg)

## Page Builder Integration Framework: The Details

As part of the Page Builder integration to PWA Studio, we implemented a framework that converts Page Builder’s master format (HTML) into a structured format that works in React and PWA Studio. The components and functions within the Page Builder integration work together to:

*  Receives Page Builder content types in the original HTML format (**RichContent** and **PageBuilder** components)

*  Extracts the content and properties from each content type's HTML (**Master Format parser**, **config function**, and **property aggregators**)

*  Retrieves the equivalent content type React components for those content types (**ContentTypeFactory**, **config function**, and **content type components**)

*  Populates those React components with the content and style properties from the original content types (**ContentTypeFactory and content type components**)

*  Returns those components for for display in a PWA Studio app (**PageBuilder** and **RichContent** components)

The components and functions that provide these services are described as follows:

**RichContent**: The `<RichContent />` component provides the entry point into the Page Builder PWA framework. It determines whether the HTML passed by the PWA Studio app contains Page Builder content. If it does, the HTML is sent to the `<PageBuilder />` component for processing. If not, the HTML is sent directly to the PWA Studio app for display.

**PageBuilder**: The `<PageBuilder />` component (not to be confused with the individual Page Builder React components) directs the parsing of the master format HTML as well as retrieving, populating, and returning the equivalent React components back to the Venia app.

**Master Format parser**: The master format parser (`parseStorageHtml()`) decomposes the master format HTML into the content type HTML fragments (HTMLElements) that compose the master format. The parser sends the content type HTML to the correct property aggregator (`configAggregator`) using the configuration object.

**Config function** (_integration point_): The configuration function (`getContentTypeConfig()`) provides an interface for retrieving a content type's _property aggregator_ and its corresponding _content type component_. The configuration object also provides the integration point for your own custom content type components. See [Set up component][] for details.

**Property aggregator** (_integration point_): The property aggregator for a content type (example: `bannerConfigAggregator`) is a function that retrieves both content and style properties from the content type's HTML. Aggregators typically use both DOM properties and several provided framework utility functions to retrieve these properties and write them to flat property objects used to populate the content type React components. For each of your custom content types, you will need to create your own property aggregator. See [Add aggregator][] for details.

**Content type component** (_integration point_): The content type component is a React component that is equivalent to a Page Builder content type. There are 15 content type components within PWA Studio: Row, Column, Tabs, Banners, Sliders, and so on. Each content type component is populated with the original content and style properties from the content type to faithfully represent your Page Builder content within a PWA Studio app like Venia. For each of your custom content types, you will need to create the equivalent content type React component . See [Add component][] for details.

**ContentTypeFactory**: The `<ContentTypeFactory />` component parses a property object tree to retrieve the equivalent React component for each content type property object it finds. It then populates these components and sends them back to the PWA Studio app as a composite React element displayed to the end user.

## Page Builder Integration Framework: How it works

The framework executes on the client side to ensure compatibility with the various hosting options available for Magento Commerce. The following flow diagram describes how the parts of the framework work together to render Page Builder components within the Venia app.

![Page Builder Integration Details](images/PageBuilderIntegrationDetails.svg)

1. The **Venia app** sends a GraphQL query to get the user's requested page. This requested page comes from the `content` field of `cms_pages` table in Magento's database. The content returned is an HTML string with Page Builder meta data. We call this HTML string the master format, which is passed to the `<RichContent />` component for initial processing.

2. The **RichContent** component determines if the HTML string contains Page Builder content, using simple pattern recognition. If the HTML does not include Page Builder content, it is returned to Venia and rendered as plain HTML. If the HTML does include Page Builder content, the HTML string (which we can now define as a master format) is passed to the `<PageBuilder />` framework component, which starts the process of matching the content types within the master format to their equivalent PWA Studio React components.

3. The **PageBuilder** framework component passes the master format to the framework's parser function called `parseStorageHTML()`.

4. The **parser** function parses the master format HTML recursively to decompose all the Page Builder content types into their own `HTMLElement` strings for further processing. When the parser finds a content type, it uses the framework's config function to access that content type's property aggregator. The aggregator retrieves content and styles from the `HTMLElement` and writes them to a flat object (used later to hydrate the content type component).

   {: .bs-callout-info}
   Each Page Builder content type has its own corresponding property aggregator. For example, the Heading content type (rendered in the master format as HTML) has a Heading aggregator (`headingConfigAggregator`), which converts the Heading's HTML properties to a flat object with those same properties. The parser does this for each content type it finds in the master format: uses the `getContentTypeConfig()` function to find and run the content type's property aggregator, which returns an object with both the content and the style properties for that content type. All CMS pages built with Page Builder have at least two content types: a Row content type and at least one other content type contained within that Row, such as a Banner.

5. When the **parser** function finishes processing all the content types within the master format, it returns a property object tree for those content types back to the `<PageBuilder />` component.

6. The **PageBuilder** framework component passes the property object tree to the framework's `<ContentTypeFactory />` component for further processing.

7. Much like in step 4 with the parser, the framework's **ContentTypeFactory** component retrieves the equivalent React component for each content type property object it finds within the object tree.

8. The **ContentTypeFactory** populates those React components with the property values retrieved from each content type's property aggregator.

9. And finally, the **PageBuilder** framework component returns a composite React element with all the Page Builder content type components needed to render the original Page Builder content within a PWA Studio app.

[Quote-Testimonial content type]: https://devdocs.magento.com/page-builder/docs/create-custom-content-type/overview.html
[Creating custom components]: <{%link pagebuilder/custom-components/overview/index.md %}>
[add aggregator]: <{%link pagebuilder/custom-components/add-aggregator/index.md %}>
[set up component]: <{%link pagebuilder/custom-components/setup-component/index.md %}>
[add component]: <{%link pagebuilder/custom-components/add-component/index.md %}>
