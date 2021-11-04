# Release 12.1.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.1.0_
_For older release notes, see_ [PWA Studio releases][].

| Type  | Status       | Assignee                 | Description                                                                           | Jira Issue   | GitHub PR       | Release    |
| :---- | :----------- | :----------------------- | :------------------------------------------------------------------------------------ | :----------- | :-------------- | :--------- |
| Task  | Done         |                          | Publish new Magento PWA meta package https://github.com/magento-commerce/magento2-pwa | [PWA-2329][] | No PR           | PWA-12.1.0 |
| Bug   | Deployment Q | Tommy Wiebell            | Cypress snapshots outdated with newsletter in footer                                  | [PWA-2287][] | [3506][]        | PWA-12.1.0 |
| Bug   | Deployment Q | Devagouda Patil          | Venia Mega nav is broken in scaffolded app on develop branch.                         | [PWA-2286][] | [3513][]        | PWA-12.1.0 |
| Task  | Deployment Q | Devagouda Patil          | Repo Metadata Service Onboarding: UPWARD-PHP                                          | [PWA-2251][] | [5][]           | PWA-12.1.0 |
| Bug   | Deployment Q | Justin Conabree          | Cart remains active in browser memory on PWA site even after checkout                 | [PWA-2190][] | [3495][]        | PWA-12.1.0 |
| Story | Deployment Q | Tommy Wiebell            | Parallelize Cypress tests on the CI                                                   | [PWA-2154][] | [3460][]        | PWA-12.1.0 |
| Story | Deployment Q | James Calcaben           | Venia Sample Data metapackage deployVeniaSampleData.sh script update                  | [PWA-2151][] | [3473][]        | PWA-12.1.0 |
| Task  | Deployment Q | Tommy Wiebell            | Add installation instructions to Venia Sample Data repo                               | [PWA-2141][] | [8][]           | PWA-12.1.0 |
| Task  | Deployment Q | Bruce Denham             | Add local and Cloud installation instructions to meta packages                        | [PWA-2140][] | [4][], [1][]    | PWA-12.1.0 |
| Bug   | Deployment Q |                          | Cart page out of stock crash                                                          | [PWA-2133][] | [3447][], [6][] | PWA-12.1.0 |
| Story | Deployment Q |                          | Update Item Quantities                                                                | [PWA-2132][] | [3464][]        | PWA-12.1.0 |
| Bug   | Deployment Q | Revanth kumar Annavarapu | Improve Venia "create" scaffold script to stop relying on NPM log output              | [PWA-2131][] | [3463][]        | PWA-12.1.0 |
| Story | Deployment Q | Ievgen Kolesov           | Create Venia Sample Data metapackage                                                  | [PWA-2106][] | [2][]           | PWA-12.1.0 |
| Story | Deployment Q | Tommy Wiebell            | GQL Support for Contact Us & Newsletter                                               | [PWA-2004][] | [5][]           | PWA-12.1.0 |
| Story | Deployment Q | Justin Conabree          | Refactor Site Header to use Tailwind Theme                                            | [PWA-1885][] | [3472][]        | PWA-12.1.0 |

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

### Update template files

The following template files contain updates in 12.1.0:

- [src/.storybook/config.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/.storybook/config.js)
- [src/index.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/index.js)
- [src/ServiceWorker/registerRoutes.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/ServiceWorker/registerRoutes.js)
- [src/ServiceWorker/setupWorkbox.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/ServiceWorker/setupWorkbox.js)
- [src/ServiceWorker/Utilities/ImageCacheHandler.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/ServiceWorker/Utilities/ImageCacheHandler.js)
- [.graphqlconfig](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/.grpahqlconfig)
- [package.json](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/package.json)
- [template.html](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/template.html)
- [webpack.config.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/webpack.config.js)

If you did not make any modifications to these files, you can copy and paste the new content over your old template files in your project.
If you made modifications to these files in your project, you will have to manually apply the changes by using `git diff` on the PWA Studio repository or by using a [diff tool][].

[diff tool]: https://marketplace.visualstudio.com/search?term=diff&target=VSCode&category=All%20categories&sortBy=Relevance

### New template files

The following template files have been added in 12.1.0:

- [src/index.css](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/index.css)
- [postcss.config.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/postcss.config.js)
- [tailwind.config.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/tailwind.config.js)

Add these files to your project as part of your project upgrade to 12.1.0.


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

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases "releases"