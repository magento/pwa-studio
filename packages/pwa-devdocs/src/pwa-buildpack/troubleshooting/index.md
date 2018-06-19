---
title: Troubleshooting
---

This page lists solutions for common issues reported by community members for the PWA Buildpack project.
If you run into any other problems please [create an issue] or let us know in our [Slack channel].

To provide more details for your issue, enable verbose console logging.
Instead of `npm start` run the following command to set a debugging environment variable:

``` sh
DEBUG=pwa-buildpack:* npm start
```

Paste the result console output into the issue. Thank you!

## Common issues

* [Browser displays "Cannot proxy to " error and the console displays `ENOTFOUND`](#cannot-proxy)
* [Webpack hangs for a long time before beginning compilation](#webpack-hangs)
* [Browser cannot resolve the `.local.pwadev` site](#cannot-resolve-site)
* [Browser does not trust the generated SSL certificate](#untrusted-ssl-cert)

## Resolutions

**Browser displays "Cannot proxy to " error and the console displays `ENOTFOUND`**{:#cannot-proxy}

Make sure your Magento store loads in more than one browser.

If you are running a local DNS server or VPN, add an entry to your hostfile and manually map this domain so NodeJS can resolve it.

**Webpack hangs for a long time before beginning compilation**{:#webpack-hangs}

You may have an old version of the `pwa-buildpack` project.
Update your project using the following command:

``` sh
npm upgrade
```

Make sure you have a current version of openssl on your system using the following command:

``` sh
openssl version
```

The version should be 1.0 or above (or LibreSSL 2, in the case of OSX High Sierra.)

You can install higher versions of OpenSSL with [Homebrew] on OSX, [Chocolatey] on Windows, or your Linux distribution's package manager.

**Browser cannot resolve the `.local.pwadev` site**{:#cannot-resolve-site}

Something has edited your hostfile, and the local PWA Studio dev database is out of sync.
Regenerate the database file by deleting it with the following command:
``` sh
rm ~/.config/pwa-buildpack.db
```

**Browser does not trust the generated SSL certificate**{:#untrusted-ssl-cert}

Make sure you have a current version of openssl on your system using the following command:

``` sh
openssl version
```

The version should be 1.0 or above (or LibreSSL 2, in the case of OSX High Sierra.)

You can install higher versions of OpenSSL with [Homebrew] on OSX, [Chocolatey] on Windows, or your Linux distribution's package manager.

[create an issue]: https://github.com/magento-research/pwa-buildpack/issues
[Slack channel]: https://magentocommeng.slack.com/messages/C71HNKYS2/team/UAFV915FB/
[Homebrew]: https://brew.sh/
[Chocolatey]: https://chocolatey.org/