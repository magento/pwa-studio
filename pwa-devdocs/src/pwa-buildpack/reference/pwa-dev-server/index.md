---
title: PWADevServer
adobeio: /api/buildpack/webpack/dev-server/
---

A utility for configuring a development OS and a `webpack-dev-server` for PWA development.

A typical webpack local development environment uses the [`devServer`][] settings in `webpack.config.js` to create a temporary, local HTTP server to show edits in real time.

## Basic Features

PWADevServer adds an optimized PWA development server to a Webpack configuration object.

The dev server provides the following useful features:

### Hot reload

The hot reload feature refreshes the page or a relevant subsection of the page whenever you save a change that affects it.
It uses Webpack's [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) feature to replace components and stylesheets inline.

### Proxy server

The dev server acts as a proxy server for API and media requests to Magento.
It is configured using environment variables.

The `MAGENTO_BACKEND_URL` environment variable configures the proxy server to accept GraphQL, REST, and media requests and passes them to Magento.

The proxy server also transforms host and referral headers to make them compatible with Magento settings.

### Root level ServiceWorker

The dev server serves a JavaScript file at the root path that registers a ServiceWorker scoped to the whole website.
It can also disable that ServiceWorker when caching would interfere with realtime changes.

### Verbose debugging

The dev server adds verbose debugging information to error pages to help with development.

## Optional Features

The following dev server features are optional and are available on the initial run and confirmed on subsequent runs.
They are configured in the `.env` file.

### Custom hostname

The custom hostname feature uses a local hostname for the current project.
This hostname must be created for the current project by running `buildpack create-custom-origin .`.

### GraphQL Playground IDE

The dev server provides a [GraphQL Playground IDE][GraphQL Playground feature] to debug the GraphQL queries in the project.

### SSL certificate configuration

The dev server creates and cache a 'self-signed' SSL certificate that allow the use of HTTPS-only features during development.

{: .bs-callout .bs-callout-info}
**Note:**
Updating the OS security settings to trust the self-signed certificate requires elevated permissions, so
you may be prompted for a password during the setup process.

### Content transformation

The content transformation feature masks the Magento 2 domain name in all HTML
attributes, replacing it with the development server domain name.

## GraphQL Playground feature

[GraphQL Playground][] is an enhanced version of the in-browser GraphQL debugging tool GraphiQL.

Enable this feature by setting the `PWADevServerOptions.graphqlPlayground` configuration option to `true`.

Browse to the `/graphiql` path on your PWADevServer to use this feature.

[create SSL certificate]: #creating-an-ssl-certificate
[secure and unique hostname for the dev server]: #creating-a-secure-and-unique-hostname
[`devServer`]: https://webpack.js.org/configuration/dev-server/
[Promise]: https://webpack.js.org/configuration/configuration-types/#exporting-a-promise
[`SecureHostOptions`]: #securehostoptions
[`subdomain: string`]: #subdomain
[`exactDomain: string`]: #exactdomain
[GraphQL Playground feature]: #graphql-playground-feature
[GraphQL Playground]: https://github.com/prisma/graphql-playground
