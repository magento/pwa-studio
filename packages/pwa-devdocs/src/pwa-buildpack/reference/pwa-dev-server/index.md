---
title: PWADevServer
---

A utility for configuring a development OS and a `webpack-dev-server` for PWA development.

A typical webpack local development environment uses the [`devServer`] settings in `webpack.config.js` to create a temporary, local HTTP server to show edits in real time.

## Basic Features

PWADevServer creates an optimized `devServer` for Magento API-backed PWA development.

The `devServer` provides the following useful features:

### Hot reload

The hot reload feature refreshes the page or a relevant subsection of the page
whenever you save a change that affects it. It uses Webpack's
[Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)
feature to replace components and stylesheets inline.

### Proxy server

The `devServer` acts as a proxy server for API and media requests to Magento. It
is configured using environment variables.

The `MAGENTO_BACKEND_DOMAIN` environment variable configures the proxy server
to accept GraphQL, REST, and media requests and passes them to Magento.

The `MAGENTO_BACKEND_PUBLIC_PATH` environment variable allows the proxy server
to serve static resources and JavaScript files at the same URL where Magento
would serve them.

The proxy server also transforms host and referral headers to make them
compatible with Magento settings.

### Root level ServiceWorker

The `devServer` serves a JavaScript file at the root path that registers a
ServiceWorker scoped to the whole website. It can also disable that
ServiceWorker when caching would interfere with realtime changes.

## Optional Features

The following `devServer` features are optional and are available on the
initial run and confirmed on subsequent runs. They are configured in the
`webpack.config.js` file.

### Custom hostname

The custom hostname feature creates a local hostname for the current project.
An entry in the hostfile is added to resolve the hostname to the local
machine.

_**Note:** Modifying the hostfile requires elevated permissions, so you may
be prompted for a password during the setup process._

### SSL certificate configuration

The `devServer` can be configured to create and cache a 'self-signed' SSL
certificate that allow the use of HTTPS-only features during development.

_**Note:** Updating the OS security settings to trust the self-signed
certificate requires elevated permissions, so you may be prompted for a
password during the setup process._

### Content transformation

The content transformation feature masks the Magento 2 domain name in all HTML
attributes, replacing it with the development server domain name.

## API

### `configure(options)`

#### Parameters

* `options: PWADevServerOptions` - Configuration object for the PWADevserver module

The `PWADevServerOptions` object contains the following properties:

| Property: Type                   | Description                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `publicPath: string`             | **Required.** The public path to the theme assets in the backend server.                                         |
| `backendDomain: string`          | **Required.** The URL of the backend store.                                                                      |
| `paths:`[`LocalProjectLocation`] | **Required.** Describes the location of the public static assets directory and where to deploy JavaScript files. |
| `serviceWorkerFileName: string`  | **Required.** The name of the ServiceWorker file this theme creates, such as `sw.js`.                            |
| `provideSSLCert: boolean`        | **Optional.** Toggles the [create SSL certificate] feature. Set `true` to create an SSL certificate for the dev server *and* to configure the OS and browser to trust the certificate if possible.
| `provideUniqueHost: string|boolean` | **Optional.** Toggles the [create custom hostname] feature. Set `true` to create a unique hostname using the `package.json` `"name"` field. Or, set a custom string, e.g. `"my-special-pwa"`, to override the package name.
| `id: string`                     | **Optional.** Toggles and customizes the [create custom hostname] feature. Create a custom hostname exactly from the ID string, without adding a hash to ensure uniqueness. Overrides `provideUniqueHost`.
| `changeOrigin: boolean`          | **Experimental.** Toggles the [change origins in HTML] feature. Defaults to `false`.                                      |
{:style="table-layout:auto"}

**Return:**

A [Promise] configuration type for webpack.

{: .bs-callout .bs-callout-info}
**Note:**
`PWADevServer.configure()` is asynchronous.

## Example

In `webpack.config.js`:

``` js
const path = require('path');
const buildpack = require('@magento/pwa-buildpack');
const PWADevServer = buildpack.Webpack.PWADevServer;

module.exports = async env => {
    const config {
        /* webpack entry, output, rules, etc */

        devServer: await PWADevServer.configure({
            publicPath: '/pub/static/frontend/Vendor/theme/en_US/',
            backendDomain: 'https://magento2.localdomain',
            serviceWorkerFileName: 'sw.js',
            paths: {
                output: path.resolve(__dirname, 'web/js'),
                assets: path.resolve(__dirname, 'web')
            },
            provideUniqueHost: 'magento-venia',
            provideSSLCert: true
        })
    };

    config.output.publicPath = config.devServer.publicPath;

    return config;
}
```

{: .bs-callout .bs-callout-info}
**Note:**
The example provided uses the newer, cleaner `async/await` syntax instead of using Promises directly.

{: .bs-callout .bs-callout-info}
**Note:**
The emitted `devServer` object may have a custom `publicPath`.
To get the best performance from the ServiceWorker, set `config.output.publicpath` to the `publicPath` value once the `devServer` is created but before creating a ServiceWorker plugin.

## Creating an SSL Certificate

PWA features like ServiceWorkers and Push Notifications are only available on
HTTPS secure domains (though some browsers make exceptions for the domain
`localhost`. HTTPS development is becoming the norm, but creating a
self-signed certificate and configuring your server and browser for it can
still be a complex process. The `PWADevServerOptions.provideSSLCert`
configuration flag tells PWADevServer to look for a cached SSL certificate,
or create one for the dev server to use.

It also attempts to use OS-level security settings to "trust" this certificate,
so you don't have to manually override when the browser tells you the
certificate authority is unknown. Browsers will soon start requiring trust as
well as SSL itself to enable some features.

**PWADevServer uses OpenSSL to generate these certificates; your operating
system must have an `openssl` command of version 1.0 or above to use this
feature.**

This feature also requires administrative access, so it may prompt you for
an administrative password at the command line. It does not permanently
elevate permissions for the dev process; instead, it launches a privileged
subprocess to execute one command.

## Creating a custom hostname

PWA features like ServiceWorkers use the concept of a 'scope' to separate
installed ServiceWorkers from each other. A scope is a combination of a domain
name, port, and path. If you use `localhost` for development multiple PWAs,
you run the risk of their Service Workers overriding or colliding with each
other.

One solution to this is to create a custom local hostname for each project.
The `PWADevServerOptions.provideUniqueHost` and `PWADevServerOptions.id`
configuration flags tell PWADevServer to create and route a hostname on first
run, and verify it on subsequent runs.

Set `provideUniqueHost: true` for the simplest configuration. This option
detects the project name by looking up the `name` property in `package.json`,
and combines it with a short hash string derived from the project directory.
This ensures a consistent domain while working in the same directory, and also
automatically different URLs for projects at different paths. For example, the
`name` field in Venia is `theme-frontend-venia`, so an autogenerated unique
host might look like `https://theme-frontend-venia-a6g2k.local.pwadev`.

Set `provideUniqueHost` to a string value to partly customize this behavior.
This option uses the provided string instead of looking up the project name in
`package.json`. For example, `provideUniqueHost: "kookaburra"` might produce a
hostname like `https://kookaburra-na87h.local.pwadev`.

Set `id` to a string value to create a custom domain name, but override both the
automated name lookup and the hashing behavior to ensure uniqueness.
For example, `id: "my-special-pwa"` would produce the hostname
`https://my-special-pwa.local.pwadev`, whereas
`provideUniqueHost: "my-special-pwa"` might produce the hostname
`https://my-special-pwa-c712jb.local.pwadev`. *To ensure no collision of Service
Workers, the `provideUniqueHost` option is recommended.*

## Change Origins In HTML URLs

The `PWADevServerOptions.changeOrigin` property toggles an experimental feature
that tries to parse HTML responses from the proxied Magento backend and replaces
its domain name with the dev server domain name.

[create SSL certificate]: #creating-an-ssl-certificate
[create custom hostname]: #creating-a-custom-hostname
[change origins in HTML]: #change-origins-in-html-urls
[`devServer`]: https://webpack.js.org/configuration/dev-server/
[Promise]: https://webpack.js.org/configuration/configuration-types/#exporting-a-promise
[`LocalProjectLocation`]: {{ site.baseurl }}{%link pwa-buildpack/reference/object-types/index.md %}#localprojectlocation
