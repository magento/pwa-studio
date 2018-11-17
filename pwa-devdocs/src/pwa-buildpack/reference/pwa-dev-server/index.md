---
title: PWADevServer
---

A utility for configuring a development OS and a `webpack-dev-server` for PWA development.

A typical webpack local development environment uses the [`devServer`][] settings in `webpack.config.js` to create a temporary, local HTTP server to show edits in real time.

## Basic Features

PWADevServer creates an optimized `devServer` for Magento API-backed PWA development.

The `devServer` provides the following useful features:

### Hot reload

The hot reload feature refreshes the page or a relevant subsection of the page whenever you save a change that affects it.
It uses Webpack's [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) feature to replace components and stylesheets inline.

### Proxy server

The `devServer` acts as a proxy server for API and media requests to Magento.
It is configured using environment variables.

The `MAGENTO_BACKEND_DOMAIN` environment variable configures the proxy server to accept GraphQL, REST, and media requests and passes them to Magento.

The `MAGENTO_BACKEND_PUBLIC_PATH` environment variable allows the proxy server to serve static resources and JavaScript files at the same URL where Magento would serve them.

The proxy server also transforms host and referral headers to make them compatible with Magento settings.

### Root level ServiceWorker

The `devServer` serves a JavaScript file at the root path that registers a ServiceWorker scoped to the whole website.
It can also disable that ServiceWorker when caching would interfere with realtime changes.

### Verbose debugging

The `devServer` adds verbose debugging information to error pages to help with development.

## Optional Features

The following `devServer` features are optional and are available on the initial run and confirmed on subsequent runs.
They are configured in the `webpack.config.js` file.

### Custom hostname

The custom hostname feature creates a local hostname for the current project.
An entry in the hostfile is added to resolve the hostname to the local machine.

{: .bs-callout .bs-callout-info}
**Note:**
Modifying the hostfile requires elevated permissions, so you may be prompted for a password during the setup process.

### GraphQL Playground IDE

The `devServer` can be configured to provide a [GraphQL Playground IDE][GraphQL Playground feature] to debug the GraphQL queries in the project.

### SSL certificate configuration

The `devServer` can be configured to create and cache a 'self-signed' SSL certificate that allow the use of HTTPS-only features during development.

{: .bs-callout .bs-callout-info}
**Note:**
Updating the OS security settings to trust the self-signed certificate requires elevated permissions, so
you may be prompted for a password during the setup process.

### Content transformation

The content transformation feature masks the Magento 2 domain name in all HTML
attributes, replacing it with the development server domain name.

## API

### `configure(options)`

#### Parameters

* `options: PWADevServerOptions` - Configuration object for the PWADevserver module

The `PWADevServerOptions` object contains the following properties:

| Property: Type                                        | Description                                                                                                                                                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `publicPath: string`                                  | **Required.** The public path to the PWA storefront assets in the backend server.                                                                                                                                     |
| `provideSecureHost: boolean/SecureHostOptions`        | **Optional.** Use a [secure and unique hostname for the dev server][]                                                                                                                                                      |
| `graphqlPlayground: boolean/GraphQLPlaygroundOptions` | **Optional.** Enable the [GraphQL Playground feature][]                                                                                                                                                                    |
| `id: string`                                          | **Deprecated.** Toggles and customizes the [create custom hostname] feature. Create a custom hostname exactly from the ID string, without adding a hash to ensure uniqueness. Overrides `provideSecureHost`. |
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
            publicPath: '/',
            provideSecureHost: true,
            graphqlPlayground: {
              queryDirs: ['src/queries']
            }
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

PWA features like ServiceWorkers and Push Notifications are only available on HTTPS secure domains (though some browsers make exceptions for the domain `localhost`.
HTTPS development is becoming the norm, but creating a self-signed certificate and configuring your server and browser to support this is a complex process.


The `PWADevServerOptions.provideSSLCert` configuration flag tells PWADevServer to look for a cached SSL certificate, or create one for the dev server to use.

It uses OS-level security settings to "trust" this certificate and prevents unknown certificate authority errors in the browser.
In the future, browsers will start requiring trust as well as SSL itself to enable some features.

{: .bs-callout .bs-callout-info}
**Note:**
PWADevServer uses OpenSSL to generate these certificates; your operating system must have an `openssl` command of version 1.0 or above to use this feature.

This feature requires administrative access, so
it may prompt you for an administrative password at the command line.
It does not permanently elevate permissions for the dev process;
instead, it launches a privileged subprocess to execute one command.

## Creating a secure and unique hostname

PWA features, such as ServiceWorkers, use the concept of a 'scope' to separate installed ServiceWorkers from each other.
A scope is a combination of a domain name, port, and path.
If you use `localhost` for developing multiple PWAs, you run the risk of Service Workers overriding or colliding with each other.

The `PWADevServerOptions.provideSecureHost` configuration option solves this problem by telling the PWADevServer to generate a unique hostname.
This configuration option expects a boolean value or a [`SecureHostOptions`][] configuration object.

Set `provideSecureHost` to `true` to use the default behavior for setting the hostname.
The default behavior generates a subdomain for `local.pwadev` using the project name in `package.json` plus a hash.
It also generates a unique port for the dev server.
The hash string and port are derived from the filesystem path, so
the values stay the same unless the project is moved.

For example, if the `name` field in the `package.json` file for your project is `theme-frontend-venia`,
an autogenerated, unique host can look like the following:

``` sh
https://theme-frontend-venia-a6g2k.local.pwadev.
```

{: .bs-callout .bs-callout-info}
**Note:**
The first time the DevServer runs, it needs temporary permission to edit the hostfile and trust the SSL certificate, so
it will prompt you for your system password.

### Specifying a port

There is no configuration option for disabling the unique port generation and usage.
To override the port for one session, use the environment variable `PWA_STUDIO_PORTS_DEVELOPMENT` to specify a port.

{: .bs-callout .bs-callout-info}
**Note:**
If PWADevServer detects that the project port is in use, it will print a warning and use a different port temporarily.

### `SecureHostOptions`

You can set the value of `provideSecureHost` to a JavaScript object to explicitly set the hostname for the dev server:

| Property                  | Description                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------- |
| [`subdomain: string`][]   | A custom subdomain string to use instead of the name in `package.json`.                 |
| [`exactDomain: string`][] | A fully qualified domain to use. Ignores `addUniqueHash` if set.                        |
| `addUniqueHash: boolean`  | Add a short string of URL-safe characters to the subdomain. The default value is `true` |
{:style="table-layout:auto"}

#### `subdomain`

The `subdomain` property overrides the default behavior of using the project name in `package.json` as part of the subdomain.
A unique hash is still appended when using this option.

For example, setting `subdomain` to `kookaburra` will generate a hostname that looks like the following:

```sh
https://kookaburra-na87h.local.pwadev
```

This is the recommended option for naming a dev server because it guarantees no collisions between Service Workers.

#### `exactDomain`

The `exactDomain` property overrides both `subdomain` and `addUniqueHash` options.
This lets you specify the exact domain for your dev server.
The domain will not have a unique hash appended to it, but
it will still have a unique port.

For example, setting `exactDomain` to `my-special-pwa` will generate a hostname that looks like the following:

```sh
https://my-special-pwa.local.pwadev
```

## GraphQL Playground feature

[GraphQL Playground][] is an enhanced version of the in-browser GraphQL debugging tool GraphiQL.

Enable this feature by setting the `PWADevServerOptions.graphqlPlayground` configuration option to `true`.

Browse to the `/graphiql` path on your PWADevServer to use this feature.

### `GraphQLPlaygroundOptions`

Instead of a boolean value, you can specify the following GraphQL Playground options by passing in a JavaScript object:

| Property              | Description                                                           |
| --------------------- | --------------------------------------------------------------------- |
| `queryDirs: string[]` | A list of directories to scan that contain GraphQL(`.graphql`) files. |
{:style="table-layout:auto"}

[create SSL certificate]: #creating-an-ssl-certificate
[secure and unique hostname for the dev server]: #creating-a-secure-and-unique-hostname
[`devServer`]: https://webpack.js.org/configuration/dev-server/
[Promise]: https://webpack.js.org/configuration/configuration-types/#exporting-a-promise
[`SecureHostOptions`]: #securehostoptions
[`subdomain: string`]: #subdomain
[`exactDomain: string`]: #exactdomain
[GraphQL Playground feature]: #graphql-playground-feature
[GraphQL Playground]: https://github.com/prisma/graphql-playground
[`LocalProjectLocation`]: {{ site.baseurl }}{%link pwa-buildpack/reference/object-types/index.md %}#localprojectlocation
