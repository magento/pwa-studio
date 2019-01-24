---
title: ProxyResolver
---

Use a **ProxyResolver** to pass a request to another service.
This resolver is guaranteed to resolve into an object with `status`, `headers`, and `body` properties from a logical point of view.

Implementations may handle request objects directly to improve performance.

| Property          | Type                | Default | Description                                                                                |
| ----------------- | ------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `target`          | `Resolved<string>`  | -       | The URL of the service                                                                     |
| `ignoreSSLErrors` | `Resolved<boolean>` | `false` | Ignore remote SSL certificate errors (useful for internal communication among containers). |
{: style="table-layout:auto" }

```yml
proxy:
    target: env.MAGENTO_BACKEND_URL
    ignoreSSLErrors: true
```

ProxyResolvers are special targets for static analysis.
Analysis systems can use simple techniques to determine proxying rules by walking up the UPWARD tree.
This is effectively a declarative proxy configuration, and
deployment tools can be enhanced to create proxy servers in front of UPWARD where appropriate.
