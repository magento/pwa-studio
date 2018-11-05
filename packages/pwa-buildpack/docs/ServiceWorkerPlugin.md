# ServiceWorkerPlugin

Webpack plugin for configuring a ServiceWorker for different PWA development
scenarios.

## Purpose

This plugin is a wrapper around the [Google Workbox Webpack Plugin](https://developers.google.com/web/tools/workbox/guides/generate-service-worker/).
It generates a caching ServiceWorker based on assets emitted by Webpack.

This plugin can be configured to run in the following modes:

- *normal development* - ServiceWorker is disabled
- *service worker debugging* - ServiceWorker and hot-reloading are enabled

## Usage

In `webpack.config.js`:

```js
const path = require('path');
const buildpack = require('@magento/pwa-buildpack');
const ServiceWorkerPlugin = buildpack.Webpack.ServiceWorkerPlugin;

module.exports = async env => {
    const config = {
        /* webpack config, i.e. entry, output, etc. */
        plugins: [
            /* other plugins */
            new ServiceWorkerPlugin({
                env: {
                    mode: 'development'
                },

                paths: {
                    output: path.resolve(__dirname, 'web')
                },
                enableServiceWorkerDebugging: true,
                serviceWorkerFileName: 'sw.js',
                runtimeCacheAssetPath: 'https://cdn.url'
            })
        ]
    };

    return config;

};
```

### API

`ServiceWorkerPlugin(options: PluginOptions): Plugin`
Plugin constructor for the `ServiceWorkerPlugin` class.

#### `PluginOptions`

`env: Object` **(Required)**
 An object that represents the current environment.
- `env.mode: String` **(Required)**
    Must be either `'development'` or `'production'`.

`paths: Object` **(Required)**
The local absolute paths to project folders.

- `paths.output: String`

   The directory for build output.

`enableServiceWorkerDebugging: Boolean`
When `true`, hot reloading is enabled and the ServiceWorker is active in the document root, regardless of the publicPath value.
When `false`, the ServiceWorker is disabled to prevent cache interruptions when hot reloading assets.

`serviceWorkerFileName: String` **(Required)**
The name of the ServiceWorker file this project creates.
Example: `'sw.js'`

`runtimeCacheAssetPath: String`
A path or remote URL that represents the root path to assets the ServiceWorker should cache as requested during runtime.
