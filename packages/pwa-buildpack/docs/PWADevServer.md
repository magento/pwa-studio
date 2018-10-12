# PWADevServer

Utility for configuring a development OS and a `webpack-dev-server` for PWA
development.

## Usage

In `webpack.config.js`:

```js
const path = require('path');
const buildpack = require('@magento/pwa-buildpack');
const PWADevServer = buildpack.Webpack.PWADevServer;

module.exports = async env => {
    const config {
        /* webpack entry, output, rules, etc */

        devServer: await PWADevServer.configure({
            publicPath: '/',
            provideSecureHost: true
        })
    };


    config.output.publicPath = config.devServer.publicPath;

    return config;
}
```

- ⚠️ `PWADevServer.configure()` is async and returns a Promise, so a webpack
    config that uses it must use the [Exporting a Promise configuration type](https://webpack.js.org/configuration/configuration-types/#exporting-a-promise).
    The newer `async/await` syntax looks cleaner than using Promises directly.
- ⚠️ The emitted `devServer` object may have a custom `publicPath`. For best
    ServiceWorker functionality, set `config.output.publicPath` to this value
    once the `devServer` is created and before creating a ServiceWorker plugin.

### Purpose

The typical webpack local development scenario uses [the devServer settings in
`webpack.config.js`](https://webpack.js.org/configuration/dev-server/) to create
a temporary local HTTP server for showing edits in real time.

PWA development has a couple of particular needs:

- The host must be _secure_ and _trusted_ to allow ServiceWorker operation
- The host must be _unique_ to prevent ServiceWorker collisions

Furthermore, Magento PWAs are Magento 2 themes running on Magento 2 stores, so
they need to proxy backend requests to the backing store in a customized way.

PWADevServer` handles all these needs:

- Creates and caches a custom local hostname for the current project
- Adds the custom local hostname to `/etc/hosts`   🔐
- Creates and caches an SSL certificate for the custom local hostname
- Adds the certificate to the OS-level keychain so browsers trust it  🔐
- Customizes the `webpack-dev-server` instance to:
  - Proxy all asset requests not managed by webpack to the Magento store
  - Emulate the public path settings of the Magento store
  - Automatically switch domain names in HTML attributes
  - Debug or disable ServiceWorkers

*The 🔐  in the above list indicates that you may be asked for a password at
this step.*

### API

`PWADevServer` has only one method: `.configure(options)`. It returns a Promise
for an object that can be assigned to the `devServer` property in webpack
configuration.

#### `PWADevServer.configure(options: PWADevServerOptions): Promise<devServer>`

#### `options`

- `id: string`: A unique ID for this project. Project name is
   recommended, but you can use any domain-name-safe string. If you're
   developing several copies of a project simultaneously, you can use this ID to
   distinguish them in the internal tooling; for example, this id will be used
   to create your dev domain name.
- `provideSecureHost: object|boolean`: Create and use a unique secure HTTPS host for this project. If an object, can contain properties `subdomain`, `exactDomain`, and `addUniqueHash` to customize.
- `publicPath: string`: **Required.** The public path of project assets in the
   backend server, e.g. `'/'`: **Required.** The URL of the backing store.
