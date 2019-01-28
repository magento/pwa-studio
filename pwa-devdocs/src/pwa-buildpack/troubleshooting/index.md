---
title: Troubleshooting
---

This page lists solutions for common issues reported by community members for the PWA Buildpack project.
If you run into any other problems please [create an issue] or let us know in our [Slack channel].

To provide more details for your issue, enable verbose console logging.
Instead of `yarn start` run the following command to set a debugging environment variable:

``` sh
DEBUG=pwa-buildpack:* yarn start
```

Paste the result console output into the issue. Thank you!

## Common issues

* [Validation errors when running developer mode](#validation-errors)
* [Venia queries to GraphQL produce validation errors](#graphql-validation-errors)
* [Browser displays "Cannot proxy to " error and the console displays `ENOTFOUND`](#cannot-proxy)
* [Webpack hangs for a long time before beginning compilation](#webpack-hangs)
* [Browser cannot resolve the `.local.pwadev` site](#cannot-resolve-site)
* [Browser does not trust the generated SSL certificate](#untrusted-ssl-cert)

## Resolutions

**Validation errors when running developer mode**{:#validation-errors}

Make sure you copied over the `.env.dist` file into a new `.env` file in the `packages/venia-concept` directory.
This file should specify variables for your local development environment.

**Venia queries to GraphQL produce validation errors**{:#graphql-validation-errors}

Venia and its GraphQL queries are out of sync with the schema of the connected Magentoi instance.
Make sure your Magento instance is up to date with the latest from Magento 2.3 development branch.

To test whether your queries are up to date, run the following command in the project root:

``` sh
yarn run validate-queries
```

**Browser displays "Cannot proxy to " error and the console displays `ENOTFOUND`**{:#cannot-proxy}

Make sure your Magento store loads in more than one browser.

If you are running a local DNS server or VPN, add an entry to your hostfile and manually map this domain so NodeJS can resolve it.

**Webpack hangs for a long time before beginning compilation**{:#webpack-hangs}

You may have an old version of the `pwa-buildpack` project.
Update your project using the following command:

``` sh
yarn upgrade
```

Make sure you have a current version of openssl on your system using the following command:

``` sh
openssl version
```

The version should be 1.0 or above (or LibreSSL 2, in the case of OSX High Sierra.)

You can install higher versions of OpenSSL with [Homebrew] on OSX, [Chocolatey] on Windows, or your Linux distribution's package manager.

**Browser cannot resolve the `.local.pwadev` site**{:#cannot-resolve-site}

Another program or process has edited your [host file] and removed the entry for your project domain. You can [manually edit your hostfile] to add the entry back, but you should examine your other installed software to see what has overwritten the previous change.

**Browser does not trust the generated SSL certificate**{:#untrusted-ssl-cert}

Generating certificates is handled by [devcert][]. It depends on OpenSSL, so make sure you have a current version of openssl on your system using the following command:

``` sh
openssl version
```

The version should be 1.0 or above (or LibreSSL 2, in the case of OSX High Sierra.)

You can install higher versions of OpenSSL with [Homebrew] on OSX, [Chocolatey] on Windows, or your Linux distribution's package manager.

If you're running Linux, make sure that `libnss3-tools` (or whatever the equivalent is) is installed on your system. Further information provided in [this section of the devcert readme][].

Some users have suggested deleting the `devcert` folder to trigger certificate regeneration.  

* For MacOS users, this folder is usually found at:
  ```sh
~/Library/Application Support/devcert
  ```
* For Windows users, this folder is usually found at: 
  ```text
${User}\AppData\Local\devcert
  ```

[create an issue]: https://github.com/magento-research/pwa-buildpack/issues
[Slack channel]: https://magentocommeng.slack.com/messages/C71HNKYS2/team/UAFV915FB/
[host file]: https://en.wikipedia.org/wiki/Hosts_(file)
[manually edit your hostfile]: https://support.rackspace.com/how-to/modify-your-hosts-file/
[Homebrew]: https://brew.sh/
[Chocolatey]: https://chocolatey.org/
[devcert]: https://github.com/davewasmer/devcert
[this section of the devcert readme]: https://github.com/davewasmer/devcert#skipcertutil
