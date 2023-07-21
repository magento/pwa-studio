---
title: Link
adobeio: /api/venia/components/general/Link/
---

The `Link` component wraps the [react-router-dom Link](https://v5.reactrouter.com/web/api/Link) component, but adds intelligent prefetching behavior to speed up performance. Our `Link` component binds to an `IntersectionObserver` to prefetch the target page's type (such as `product-page`), only when the link is visible in the viewport. And when possible, our `Link` loads the page from local cache to prevent unnecessary roundtrips to the server. In short, the `Link` component builds in all the best-practices that Google recommends when prefetching content for fast transitions.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/venia-ui/lib/components/Link/link.md %}