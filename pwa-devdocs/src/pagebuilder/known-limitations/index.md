---
title: Known limitations
---

The following items are known limitations to implementing PWA components for Page Builder content types:

- **Products content type** - The Alignment property as set within the Products content type form will always default to Left. Text alignment does not work within the PWA Studio gallery because the gallery is rendered with the CSS grid layout.

- **Content types with text input** - Widgets are not supported within content type components that provide text input.

- **Dynamic Block content type** - Not supported as a component in PWA Studio.

- PWA Studio currently has no concept of Dynamic Block. Dynamic Blocks required session information to correctly display their content, currently this session is not shared between - PWA and the back-end and there are no GraphQL endpoints for Dynamic Block.
- PWA Studio lacks an extensibility model disabling Page Builder from utilizing an existing framework / model. We can potentially use the comment based root component declaration that is baked into PWA studio but this will require additional work.
- PWA Studio / UPWARD doesn't currently have a CMS page router.
- PWA Studio's image optimizer can't currently optimize images without pre-defined widths.
- Should we attempt to determine the rough size of an image and resize to that?
- Some widgets (such as Products) create a large amount of output from the GraphQL endpoint, even though we don't intend to render it.
- Potentially for certain content types we shouldn't render their directives if it's being consumed by PWA?
- PWA doesn't support cache invalidation that makes Staging&Preview not supported in Venia
