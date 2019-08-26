<!-- TODO: This topic is part of Buildpack reference and should go under packages/pwa-devdocs/src/pwa-buildpack/reference/configure-webpack when it's done -->

---
title: configureWebpack
---

A utility function that generates a Webpack configuration object suited to your PWA and its dependencies.

Import and call `configureWebpack(options)` in your project's `webpack.config.js` file.
The generated configuration object tells Webpack how to process the PWA source code and generate bundles.
It's a [complete Webpack configuration object](https://webpack.js.org/configuration/), ready for immediate use, but you can also modify it in your `webpack.config.js` before returning it out of your own configure function.

## API

### `configureWebpack(options)`

#### Options

| Name | Type | Default | Description
| ---- | ---- | ------- | --------------
| context | String | | _Required._ The path of the project root directory.
| vendor | String[] | | A list of module names to force Webpack to load up-front in a "commons" bundle. Limit this list to strictly necessary dependencies, required by most or all modules.
| special | Object | | A map of module names to collections of flags. `configureWebpack()` will set the loaders and plugins to treat code from these modules in a "special" way, according to the flags described below.

#### Special Flags

By default, Webpack treats the source code of your project very differently than the dependency code.
Webpack does so because public NPM modules are not reliably compatible with advanced JavaScript features.
Normally, developers get around this by customizing the Webpack configuration rules.
`configureWebpack` offers a simpler API: for each module you want to treat specially, add one of these named flags.
It will adjust Webpack configuration to run that module and its files through additional build steps.

| Name | Description
| ---- | -----------
| `esModules` | Set `true` to process `.js` files from the named module as ES Modules. This allows Webpack to use advanced optimizations on them, but it may fail if the module contains noncompliant code.
| `cssModules` | Set `true` to process `.css` files from the named module as CSS Modules. This allows Webpack to maintain a separate namespace for every CSS Module, even modules inside dependencies. This prevents style collisions between sibling modules, but it may fail if the module does not actually use CSS Module patterns.
| `graphqlQueries` | Set `true` to look for `.graphql` files in the dependency and precompile them for better performance. All GraphQL query files in all modules will appear in the GraphQL playground, so this setting allows you to choose which dependencies have queries you want to debug.
| `rootComponents` | Set `true` to look for RootComponent files in the `src/RootComponents` or `RootComponents` subdirectories of this module. This allows a third-party dependency to provide RootComponents to your app automatically, but it may slow down the build if you add too many modules that don't have RootComponents.
| `upward` | Set `true` to look for an `upward.yml` file in the root of this module directory, and **merge it with the project's root `upward.yml` file. This enables third-party dependencies to contribute to UPWARD behavior, but it may cause collisions or merge problems if the UPWARD files contradict each other.

**Return:**

A [Promise] configuration type for webpack.

{: .bs-callout .bs-callout-info}
**Note:**
`configureWebpack` is asynchronous.
Webpack accepts a Promise for a configuration, so you can return the result of
`configureWebpack` directly out of the exported function in `webpack.config.js`.
If you want to modify the configuration, you'll need to `await` it.

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
            'apollo-cache-inmemory',
            'apollo-cache-persist',
            'apollo-client',
            'apollo-link-context',
            'apollo-link-http',
            'informed',
            'react',
            'react-apollo',
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
