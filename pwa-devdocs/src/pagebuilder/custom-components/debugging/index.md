---
title: Debugging tips
---

If you haven't yet modified the config object and setup the references you'll see the following console warning in your console to inform you the component is missing:

```text
parseStorageHtml.js?4091:67 No config aggregator defined for content type X, this content type won't be rendered.
```

If you _have_ modified the configuration and your content type is still not displaying, you can debug through `packages/venia-ui/lib/components/RichContent/PageBuilder/parseStorageHtml.js` to determine if your configuration item is being correctly detected.
