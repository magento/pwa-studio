---
title: configureWebpack
adobeio: /api/buildpack/webpack/configure/
---

## `configureWebpack(options)`

A function that returns a Webpack configuration object.

Import and call `configureWebpack()` in your project's `webpack.config.js` file to generate a Webpack configuration object suited to your PWA Studio project and its dependencies.

**Returns:**
A [Promise][] that resolves to a configuration object for webpack.

The generated configuration object tells Webpack how to process the project's source code and generate bundles.
It is a [complete Webpack configuration object][] that is ready for immediate use.

You can also modify it in your `webpack.config.js` before returning it out of your own configure function.

{: .bs-callout .bs-callout-info}
`configureWebpack()` is asynchronous.
Webpack accepts a Promise for a configuration, so
you can return the result of `configureWebpack` directly out of the exported function in `webpack.config.js`.
If you want to modify the configuration, you must use `await`.

### Parameters

| Name              | Type       | Description                                                              |
| ----------------- | ---------- | ------------------------------------------------------------------------ |
| `options`         | `Object`   | Options for generating the configuration object                          |
| `options.context` | `String`   | _Required._ The path of the project root directory                       |
| `options.vendor`  | `String[]` | A list of module names to force Webpack to include in a "commons" bundle |
| `options.special` | `Object`   | An object that maps module names to a set of configuration.              |

{: .bs-callout .bs-callout-info}
To make your project performant, limit the `options.vendor` list to strictly necessary dependencies required by most or all modules.

### Special flags

The `options.special` parameter tells `configureWebpack()` to create special configurations for specific modules.

By default, Webpack treats the source code of your project very differently than the dependency code.
Webpack does so because public NPM modules are not reliably compatible with advanced JavaScript features.
Developers get around this by customizing the Webpack configuration rules.

`configureWebpack()` offers a simple API: for each module you want to treat special, add these named flags.
It will adjust Webpack configuration to run that module and its files through additional build steps.

#### `esModules` flag

If `true`, `configureWebpack()` generates the configuration for processing `.js` files from the named module as ES Modules.
This allows Webpack to use advanced optimizations on them, but
it may fail if the module contains noncompliant code.

#### `cssModules` flag

If `true`, `configureWebpack()` generates the configuration for processing `.css` files from the named module as CSS Modules.
This allows Webpack to maintain a separate namespace for every CSS Module, including modules inside dependencies.

This prevents style collisions between sibling modules, but
it may fail if the module does not actually use CSS Module patterns.

#### `graphqlQueries` flag

If `true`, `configureWebpack()` generates the configuration that tells webpack to look for `.graphql` files in the dependency and precompile them for better performance.

All GraphQL query files in all modules will appear in the GraphQL playground, but
this setting allows you to choose which dependencies have queries you want to debug.

#### `rootComponents` flag

If `true`, `configureWebpack()` generates the configuration that tells webpack to look for RootComponent files in a module's `src/RootComponents` or `RootComponents` subdirectories.

This allows a third-party dependency to provide RootComponents to your app automatically, but
it may slow down the build if you add too many modules that do not have RootComponents.

#### `upward` flag

If `true`, `configureWebpack()` generates the configuration that tells weback to look for an `upward.yml` file in a module's root directory and merge it with the project's root `upward.yml` file.

This lets third-party dependencies contribute to UPWARD behavior, but
it may cause collisions or merge problems if the UPWARD files contradict each other.

## Example

The following example is taken from `packages/venia-concept/webpack.config.js`.
It represents a typical setup using `configureWebpack` to generate Webpack config.
It also demonstrates that `configureWebpack` returns a recognizable Webpack object, which you can modify.

```js
const { configureWebpack } = require('@magento/pwa-buildpack');

module.exports = async env => {
    const config = await configureWebpack({
        context: __dirname,
        vendor: [
            '@apollo/client',
            'apollo-cache-persist',
            'informed',
            'react',
            'react-dom',
            'react-feather',
            'react-redux',
            'react-router-dom',
            'redux',
            'redux-actions',
            'redux-thunk'
        ],
        special: {
            // Treat code originating in the `@magento/peregrine` module
            // as ES Modules, just like the project source itself.
            '@magento/peregrine': {
                esModules: true
            }
            // Treat code originating in the `@magento/venia-ui` as though
            // it uses ES Modules, CSS Modules, GraphQL queries, RootComponents,
            // and UPWARD definitions. This is the right set of flags for a UI
            // library that makes up the bulk of your project.
            '@magento/venia-ui': {
                cssModules: true,
                esModules: true,
                graphqlQueries: true,
                rootComponents: true,
                upward: true
            }
        },
        env
    });

    // configureWebpack() returns a regular Webpack configuration object.
    // You can customize the build by mutating the object here, as in
    // this example:
    config.module.noParse = [/braintree\-web\-drop\-in/];
    // Since it's a regular Webpack configuration, the object supports the
    // `module.noParse` option in Webpack, documented here:
    // https://webpack.js.org/configuration/module/#modulenoparse

    return config;
};
```

[complete webpack configuration object]: https://webpack.js.org/configuration/
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
