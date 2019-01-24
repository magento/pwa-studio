---
title: DirectoryResolver
---

Use a **DirectoryResolver** to delegate request and response handling to a static server.

Unlike the [ProxyResolver][], this resolver needs access to a local directory, which it serves as a public assets folder.

Much like the ProxyResolver, this resolver exists to bolster the notion that an UPWARD file can describe the expected behavior of a PWA server-side site in detail.

| Property    | Type               | Default | Description             |
| ----------- | ------------------ | ------- | ----------------------- |
| `directory` | `Resolved<string>` | -       | The directory to target |

{: style="table-layout:auto" }

```yml
static:
    directory:
        inline: './dist'
```

[ProxyResolver]: {{site.baseurl}}{%link upward/resolvers/proxy/index.md %}
