# Release 12.1.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.1.0_
_For older release notes, see_ [PWA Studio releases][].

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
| Task  | Add local and Cloud installation instructions to meta packages           | [PWA-2140][] | [4][][1][]    |
| Bug   | Cart page out of stock crash                                             | [PWA-2133][] | [3447][][6][] |
| Story | Update Item Quantities                                                   | [PWA-2132][] | [3464][]      |
| Bug   | Improve Venia "create" scaffold script to stop relying on NPM log output | [PWA-2131][] | [3463][]      |
| Story | Create Venia Sample Data metapackage                                     | [PWA-2106][] | [2][]         |
| Story | GQL Support for Contact Us & Newsletter                                  | [PWA-2004][] | [5][]         |
| Story | Refactor Site Header to use Tailwind Theme                               | [PWA-1885][] | [3472][]      |


## New Features

## Updates

## Bug fixes

## Documentation Updates

## Breaking Changes

## Known Issues

## Test Updates

## Repo Maintenance Tasks



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


[PWA-2332]: https://jira.corp.magento.com/browse/PWA-2332
[PWA-2331]: https://jira.corp.magento.com/browse/PWA-2331
[PWA-2330]: https://jira.corp.magento.com/browse/PWA-2330
[PWA-2329]: https://jira.corp.magento.com/browse/PWA-2329
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