---
title: create-custom-origin
adobeio: /api/buildpack/cli/create-custom-origin/
---

The `create-custom-origin` is a [`buildpack`][] CLI subcommand which creates a unique local hostname and trusted SSL certificate for your project.

Usage example with `npx`:

```sh
npx @magento/pwa-buildpack create-custom-origin <dir>
```

This feature requires administrative access, so
it may prompt you for an administrative password at the command line.
It does not permanently elevate permissions for the dev process, but
instead, it launches a privileged subprocess to execute one command.

{: .bs-callout .bs-callout-info}
**Note:**
This command should be used only in a development environment and never as part of a production deployment process.

## Why PWA development requires a secure custom origin

### HTTPS is required

Some PWA features, such as ServiceWorkers and Push Notifications, are only available on HTTPS secure domains.
Some browsers make exceptions for the domain `localhost`, but this is non-standard.

HTTPS development is becoming the norm, but
creating a self-signed certificate and configuring your server and browser to support this is a complex process.

The `create-custom-origin` command automates this process reliably on most operating systems.
It uses [devcert][] to edit your local hostfile, create and manage certificates, and try to configure web browsers to "trust" the certificate.
This prevents security errors from showing up in browsers.

In the future, browsers will require trust, as well as SSL itself, to enable some features.

{: .bs-callout .bs-callout-info}
**Note:**
PWADevServer uses OpenSSL to generate these certificates; your operating system must have an `openssl` command of version 1.0 or above to use this feature.

### Unique domains prevent ServiceWorker collisions

PWA features, such as ServiceWorkers, use the concept of a 'scope' to separate installed ServiceWorkers from each other.
A scope is a combination of a domain name, port, and path.
If you use `localhost` for developing multiple PWAs, you run the risk of Service Workers overriding or colliding with each other.

## Customization

Use environment variables in the `CUSTOM_ORIGIN_` namespace to change the behavior of the `create-custom-origin` command.

| Environment Variable Name | Default Value | Description |
| --- | --- | --- |
| `CUSTOM_ORIGIN_ENABLED` | `true` | Enable the custom origin feature |
| `CUSTOM_ORIGIN_ADD_UNIQUE_HASH` | `true` | Add a unique hash string to the custom origin. |
| `CUSTOM_ORIGIN_SUBDOMAIN` | | Allows you to manually specify the subdomain prefix of the custom origin instead of using the package name. |
| `CUSTOM_ORIGIN_EXACT_DOMAIN` | | Allows you to specify the _exact_ domain of the custom origin instead of a subdomain under `.local.pwadev`. |

Set these variables permanently in your `.env` file, or argue them at the command line for overrides:

```sh
CUSTOM_ORIGIN_EXACT_DOMAIN="my.pwa" \
npx @magento/pwa-buildpack create-custom-origin .
```

### Unique hash

If `CUSTOM_ORIGIN_ADD_UNIQUE_HASH` is set to `true`, the `create-custom-origin` command adds a unique hash string to the custom origin.
This string is based on the filesystem location.

This naturally separates domains when running multiple project folders on one developer machine.

[`buildpack`]: {%link pwa-buildpack/reference/buildpack-cli/index.md %}

[devcert]: https://github.com/davewasmer/devcert
