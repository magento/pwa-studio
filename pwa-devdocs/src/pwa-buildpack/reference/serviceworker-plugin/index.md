---
title: ServiceWorkerPlugin
---

A webpack plugin for configuring a ServiceWorker for different PWA development scenarios.

This plugin is a wrapper around the [Google Workbox Webpack Plugin].
It generates a caching ServiceWorker based on assets emitted by webpack.

The following configurations are available for this plugin:

* **normal development** - the ServiceWorker is disabled
* **service worker debugging** - the ServiceWorker and hot-reloading are enabled.

## API

### `ServiceWorker(options)`

Plugin constructor for the `ServiceWorkerPlugin` class.

#### Parameters

* **`options: PluginOptions`** - Configuration object for the ServiceWorkerPlugin

The `PluginOptions` object contains the following properties:

| Property: Type                          | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| `env:`[`EnvironmentObject`]             | **Required.** An object that represents the current environment.                   |
| `paths:`[`LocalProjectLocation`]        | **Required.** Configuration object that describes where public assets are located. |
| `enableServiceWorkerDebugging: boolean` | Toggles [service worker debugging].                                                |
| `serviceWorkerFilename: string`         | **Required.** The name of the ServiceWorker file this project creates.             |
| `runtimeCacheAssetPath: string`         | A remote URL or root path to assets the ServiceWorker should cache during runtime. |
{:style="table-layout:auto"}

The `EnvironmentObject` contains the following properties:
{:#environmentobject}

| Property: Type  | Description                                |
| --------------- | ------------------------------------------ |
| `mode: string` | Must be **development** or **production**. |
{:style="table-layout:auto"}

## Example

In `webpack.config.js`:

``` js
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

## Service worker debugging

When `PluginOptions.enableServiceWorkerDebugging` is set to `true`, hot reloading is enabled and the ServiceWorker is active in the document root.

When this value is set to `false`, the ServiceWorker is disabled to prevent cache interruptions when hot reloading assets.


[Google Workbox Webpack Plugin]: https://developers.google.com/web/tools/workbox/guides/generate-service-worker/
[`LocalProjectLocation`]: {{ site.baseurl }}{%link pwa-buildpack/reference/object-types/index.md %}#localprojectlocation
[`EnvironmentObject`]: #environmentobject
[service worker debugging]: #service-worker-debugging