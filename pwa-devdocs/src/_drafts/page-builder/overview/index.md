---
title: Overview
---

**Original WIP from Dave:**

As part of the Page Builder / PWA integration we implemented a system in which we can convert Page Builder's master format into a structured format which React and PWA Studio could understand. We did this on the client side to ensure compatibility with all various hosting methods of Magento Commerce currently available.

## Workflow

1. Page Builder content is fetched as part of an entity request to GraphQL (CMS Page, Product Description etc).
2. `<RichContent />` is employed to determine what type of content this is, using a simple pattern recognition to determine if the content is Page Builder. If the content does not include Page Builder content we opt to render this out as is.
3. Master format is passed to our dedicated `<PageBuilder />` which in term parses the HTML into objects.
4. Our `parseStorageHtml` method utilises a `TreeWalker` to iterate over all nodes within the master format, using a pattern to match all content types based on their data attribute.
5. Each detected content types name is compared to a configuration file of supported content types, if the content type isn't supported we do not render it.
6. We then pass the master format HTML for the current content type, along with all it's children, to the content types config aggregator.
7. The config aggregator extracts all required data from the content types format using DOM methods. The config aggregator then returns a simple `{key: value}` object.
8. An object tree of all content types with their associated data is built and passed to our factory.
9. The factory requests the component from the config and renders it with the props provided from the config aggregator.
