<!-- TODO: This topic is part of Buildpack reference and should go under packages/pwa-devdocs/src/pwa-buildpack/reference/configure-webpack when it's done -->

---
title: configureWebpack
---

A function that generates a Webpack configuration object suited to your PWA and its dependencies.

Import and call `configureWebpack(options)` in your project's `webpack.config.js` file.
The generated configuration object tells Webpack how to process the PWA source code and generate bundles.
It's a [complete Webpack configuration object](https://webpack.js.org/configuration/), ready for immediate use, but you can also modify it in your `webpack.config.js` before returning it out of your own configure function.

## API

### `configureWebpack(options)`

**Parameters:**

* `options:`[`ConfigureWebpackOptions`] - Configuration object that describes where the PWA storefront folders are located.

**Return:**

A [Promise] configuration type for webpack.

{: .bs-callout .bs-callout-info}
**Note:**
`MagentoResolver.configure()` is asynchronous.

### `ConfigureWebpackOptions

TODO

## Example

TODO
