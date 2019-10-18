---
title: Known limitations
---

The following items are known limitations to implementing PWA components for Page Builder content types:

-   **Widgets in TinyMCE** - Widgets are not supported within content types that provide text input from the TinyMCE editor, such as Text, Banner, Slider, and HTML Code.
-   **Dynamic Blocks** - Not supported in PWA Studio. PWA Studio currently has no concept of a Dynamic Block. Dynamic Blocks required session information to correctly display their content. Currently this session is not shared between PWA Studio and the backend and there are no GraphQL endpoints for Dynamic Block.
-   **Products text alignment** - Text alignment for Products does not work within the PWA Studio gallery because the gallery is rendered with the CSS grid layout. The Alignment property (as set within the Products content type form) will always default to `Left`.
-   **Extensibility** - PWA Studio currently lacks an extensibility model, which prevents Page Builder from using an existing framework / model. We can potentially use the comment based root component declaration that is baked into PWA Studio, but this will require additional work.
-   **Routing** - Currently, PWA Studio / UPWARD does not have a CMS page router. As a result, PWA Studio only renders Page Builder content types added to your store's Home page.
-   **Image Optimization** - PWA Studio's image optimizer can't currently optimize images without pre-defined widths.
-   **GraphQL query results** - Some content types (such as Products) create a large amount of output from the GraphQL endpoint, even though we don't intend to render it.
-   **Staging and Preview** - PWA doesn't support cache invalidation, which means Staging and Preview are not supported in Venia.
