# Release 12.1.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.1.0_
_For older release notes, see_ [PWA Studio releases][].

## New Features

-  **Added new PWA Tailwind theming to Venia Header**: Refactored the Venia site `Header` component to use our new [Tailwind](https://tailwindcss.com/) theming framework. The `Header` component is the first component to use our theming framework. Other components will follow in the coming releases. GitHub PR: [3472][].
-  **Added PWA Studio metapackages**: These metapackages establish a new way to add additional features to support your PWA modules. Future PWA Studio features will depend on one of these metapackages being present in your app. For more details, see the [PWA Magento Open Source metapackage](https://github.com/magento-commerce/magento2-pwa) and [PWA Adobe Commerce metapackage](https://github.com/magento-commerce/magento2-pwa-commerce) GitHub PRs: [4][], [1][].
-  **Added Venia Sample Data metapackage**: This metapackage provides a way to create your own sample data for your Venia-based PWA site. For more details, see the [Venia Sample Data metapackage repo](https://github.com/magento-commerce/venia-sample-data-modules). GitHub PRs: [3473][], [2][].
-  **Added GraphQL endpoint for Contact and Newsletter froms**: You can now use GraphQL to submit Contact Us and Newsletter form data to the Commerce backend. From there, you can use it to send emails and personalize your customer interactions. GitHub PR: [5][].

## Summary of all changes

| Type  | Description                                                              | Jira Issue   | GitHub PR     |
| :---- | :----------------------------------------------------------------------- | :----------- | :------------ |
| Bug   | Add to Cart flow for simple products on Home page is broken              | [PWA-2364][] | [3535][]      |
| Bug   | Cypress snapshots outdated with newsletter in footer                     | [PWA-2287][] | [3506][]      |
| Bug   | Venia Mega nav is broken in scaffolded app on develop branch.            | [PWA-2286][] | [3513][]      |
| Task  | Repo Metadata Service Onboarding: UPWARD-PHP                             | [PWA-2251][] | [5][]         |
| Bug   | Cart remains active in browser memory on PWA site even after checkout    | [PWA-2190][] | [3495][]      |
| Story | Parallelize Cypress tests on the CI                                      | [PWA-2154][] | [3460][]      |
| Story | Venia Sample Data metapackage deployVeniaSampleData.sh script update     | [PWA-2151][] | [3473][]      |
| Task  | Add installation instructions to Venia Sample Data repo                  | [PWA-2141][] | [8][]         |
| Task  | Add local and Cloud installation instructions to meta packages           | [PWA-2140][] | [4][], [1][]    |
| Bug   | Cart page out of stock crash                                             | [PWA-2133][] | [3447][], [6][] |
| Story | Update Item Quantities                                                   | [PWA-2132][] | [3464][]      |
| Bug   | Improve Venia "create" scaffold script to stop relying on NPM log output | [PWA-2131][] | [3463][]      |
| Story | Create Venia Sample Data metapackage                                     | [PWA-2106][] | [2][]         |
| Story | GQL Support for Contact Us & Newsletter                                  | [PWA-2004][] | [5][]         |
| Story | Refactor Site Header to use Tailwind Theme                               | [PWA-1885][] | [3472][]      |

## Bug fixes

-  [3464][] — **Cart**: Fixed an issue that prevented users from updating item quantities and removing items from the cart when using Magento 2.4-develop and 2.4.3 backends.
-  [3447][] — **Cart**: Fixed a rendering issue where out-of-stock products in your cart could not be removed.
-  [3495][] — **Cart**: Fixed issues that occurred when accessing the same store from different browser tabs or windows. To fix the problem, we introduced a storage listener on the cart context that fires a page reload whenever the `cartId` changes from another tab. Reloading the page forces Redux to persist a new `cartId` in storage.
-  [3535][] — **Cart**: Fixed a regression issue (during 12.1.0 development) that prevented the Add to Cart button from working on simple products featured on the Venia Home page.
-  [3513][] — **Mega Menu**: Fixed broken `Header` style when using the `develop` branch in a scaffolded project.
-  [3463][] — **Scaffolding CLI**: Fixed the Venia `_buildpack/create.js` `DEBUG_PROJECT_CREATION` test flag that broke when using NPM versions >=`7.23`.

## Documentation updates

-  [4][], [1][] — **Metapackage Installation**: Added instructions for installing our new metapackages for both local and cloud-based environments. The instructions have been added to the READMEs of the Open Source and Commerce repos: [PWA Open Source metapackage](https://github.com/magento-commerce/magento2-pwa) and [PWA Adobe Commerce metapackage](https://github.com/magento-commerce/magento2-pwa-commerce).
-  [8][] — **Venia Sample Data installation**: Added instructions for installing Venia sample data from the new [magento-commerce/venia-sample-data-modules](https://github.com/magento-commerce/venia-sample-data-modules) repo.


## Breaking Changes

-  [3447][] — The fix for the cart rendering issue requires you to install our new metapackage. The metapackage adds a new GraphQL field to the existing endpoint. And we used that field to fix the cart rendering issue ([3447][]). Therefore, if you try to run the Venia app without the metapackage, the app will break because the new field has not been added the endpoint for Commerce core.

## Known Issues

No known issues.

## Test Updates

-  [3460][] — Added Docker parallelization for Cypress testing to cut testing times by 50%. When run synchronously, the whole suite of tests took about 30 minutes. Now it takes 13–15 minutes.

-  [3506][] - Fixed outdated snapshots for failing Page Builder tests on the `develop`. The tests started failing when the Newsletter form was added to the footer.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.0.0 to 12.1.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://magento.github.io/pwa-studio/tutorials/pwa-studio-fundamentals/project-setup/
[upgrading versions]: https://magento.github.io/pwa-studio/technologies/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.1.0.
Versions that are in **bold** indicate a version change for this release.

**Note:**
Your project may not depend on some of the packages listed on this table.

| Package                         | Latest version |
| ------------------------------- | -------------- |
| `babel-preset-peregrine`        | 1.1.0          |
| `create-pwa`                    | **2.0.1**      |
| `upward-security-headers`       | **1.0.5**      |
| `venia-adobe-data-layer`        | **1.0.2**      |
| `venia-sample-backends`         | 0.0.4          |
| `venia-sample-language-packs`   | **0.0.5**      |
| `venia-sample-payments-checkmo` | **0.0.3**      |
| `pagebuilder`                   | **7.0.1**      |
| `peregrine`                     | **12.1.0**     |
| `pwa-buildpack`                 | 11.0.0         |
| `pwa-theme-venia`               | **1.1.0**      |
| `upward-js`                     | 5.2.0          |
| `upward-spec`                   | 5.1.0          |
| `venia-concept`                 | **12.1.0**     |
| `venia-ui`                      | **9.1.0**      |
| `magento2-upward-connector`     | 1.3.0          |
| `upward-php`                    | 1.2.0          |

[PWA-2364]: https://jira.corp.magento.com/browse/PWA-2364
[PWA-2287]: https://jira.corp.magento.com/browse/PWA-2287
[PWA-2286]: https://jira.corp.magento.com/browse/PWA-2286
[PWA-2251]: https://jira.corp.magento.com/browse/PWA-2251
[PWA-2190]: https://jira.corp.magento.com/browse/PWA-2190
[PWA-2154]: https://jira.corp.magento.com/browse/PWA-2154
[PWA-2151]: https://jira.corp.magento.com/browse/PWA-2151
[PWA-2141]: https://jira.corp.magento.com/browse/PWA-2141
[PWA-2140]: https://jira.corp.magento.com/browse/PWA-2140
[PWA-2133]: https://jira.corp.magento.com/browse/PWA-2133
[PWA-2132]: https://jira.corp.magento.com/browse/PWA-2132
[PWA-2131]: https://jira.corp.magento.com/browse/PWA-2131
[PWA-2106]: https://jira.corp.magento.com/browse/PWA-2106
[PWA-2004]: https://jira.corp.magento.com/browse/PWA-2004
[PWA-1885]: https://jira.corp.magento.com/browse/PWA-1885

[3535]: https://github.com/magento/pwa-studio/pull/3535
[3506]: https://github.com/magento/pwa-studio/pull/3506
[3513]: https://github.com/magento/pwa-studio/pull/3513
[5]: https://github.com/magento-commerce/upward-php/pull/5
[3495]: https://github.com/magento/pwa-studio/pull/3495
[3460]: https://github.com/magento/pwa-studio/pull/3460
[3473]: https://github.com/magento/pwa-studio/pull/3473
[8]: https://github.com/magento-commerce/venia-sample-data-modules/pull/8
[4]: https://github.com/magento-commerce/magento2-pwa/pull/4
[1]: https://github.com/magento-commerce/magento2-pwa-commerce/pull/1
[3447]: https://github.com/magento/pwa-studio/pull/3447
[6]: https://github.com/magento-commerce/magento2-pwa/pull/6
[3464]: https://github.com/magento/pwa-studio/pull/3464
[3463]: https://github.com/magento/pwa-studio/pull/3463
[2]: https://github.com/magento-commerce/venia-sample-data-modules/pull/2
[5]: https://github.com/magento-commerce/magento2-pwa/pull/5
[3472]: https://github.com/magento/pwa-studio/pull/3472

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
