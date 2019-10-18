# Release 4.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 4.0.0 and above._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 4.0.0](#whats-new-in-400)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Updating from 3.0.0](#updating-from-300)

## What's new in 4.0.0

PWA Studio 4.0.0 contains new features, refactors, breaking changes, and various improvements.

### Summary of notable changes

The following is a list of the notable changes included in this release.

#### New Peregrine Hooks

This release introduces the following new hooks in Peregrine:

-   [Toast hooks][] and [ToastContainer][] - Provide logic for managing toast messages and a container for displaying these messages.
-   [`useWindowSize()`][] - A hook that provides window size data and lets you respond to window resizing events.
-   [`useRestApi()`][] and [`useRestResponse()`][] - Hooks that expose the API for sending REST calls and handling the response.
-   [`useScrollLock()`][] - Hook that gives the ability to lock the `document` element.
-   [`usePagination()`][] - A hook that provides pagination logic for components that need to navigate through paged data.
-   [`useEventListener()`][] - A hook that gives the ability to add a callback function when an event is triggered on an element.
-   [`useCarousel()`][] - A hook for interacting with the state for a carousel of images.

[toast hooks]: https://github.com/magento/pwa-studio/tree/develop/packages/peregrine/lib/Toasts
[toastcontainer]: https://github.com/magento/pwa-studio/tree/develop/packages/venia-ui/lib/components/ToastContainer
[`usewindowsize()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useWindowSize.js
[`userestapi()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useRestApi.js
[`userestresponse()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useRestResponse.js
[`usescrolllock()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useScrollLock.js
[`usepagination()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/usePagination.js
[`useeventlistener()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useEventListener.js
[`usecarousel()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useCarousel.js

#### Component refactors

This release includes code refactors to existing components.
The main purpose for this refactor is to extract the logic from these components and convert them into re-useable Peregrine hooks, such as `useCarousel()` and `useScrollLock()`.
Another reason for refactoring some of these components is to convert them into functional components.

The list of refactored components in this release include:

-   **List**, **List Items**, and **List Item** in Peregrine
-   **Category** in RootComponent
-   **Header**, **Checkout**, **MiniCart**, **Image**, and **ProductFullDetail** in Venia
-   Various left drawer components (See PR [#1552][] for the full list of affected components)

### Summary of breaking changes

This release includes changes that may break projects dependent on PWA Studio and its tools and components.

#### `src` to `lib`

The `src` directories in Peregrine and Venia have been renamed to `lib`.
This enforces the idea that these packages are meant to be consumed as libraries, but
it also means that you may have to update your import paths in your project.

#### Venia split

The Venia project is now split into separate `venia-ui` and `venia-concept` packages.
This paves the way for better extensibility and customizability when it comes to storefront creation.

The `venia-ui` package contains the templates and components used to create the Venia storefront.
This package is meant to be used as a component library for custom storefront projects.

The `venia-concept` package contains the project scripts and configurations used to build and run the actual Venia storefront project.

This change may also require you to update import paths in your project.

See PR [#1499][]

#### New build tools

This release contains new tools for building, bundling, and configuring storefront projects.

**`buildpack` CLI command** - A command line toolkit with subcommands for:

-   Generating SSL certificates
-   Creating a `.env` file
-   Loading and validating a project's `.env` file.

See PR [#1498][]

**`configureWebpack()`** - A function that provides an opinionated configuration for Webpack.
This replaces a large portion of the `webpack.config.js` file in the Venia project in favor of a configurable utility that can be used in other storefront projects.

**`babel-preset-peregrine`** - A new package that defines a preset for Babel.
This preset is required for storefronts using Peregrine and Venia-UI components.
See PR [#1404][].

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                                                     | Change type  |    PR     |
| :-------------------------------------------------------------------------------------------------------------- | :----------: | :-------: |
| Added a feature that allows CSS in `node_modules` to circumvent CSS modules                                     | **Feature**  | [#1242][] |
| Added a layered navigation modal component for filters                                                          | **Feature**  | [#797][]  |
| Added ability to source media URL from GraphQL                                                                  | **Feature**  | [#1267][] |
| Added height to `makeUrl()` and enforced crop in middleware if provided                                         | **Feature**  | [#1361][] |
| Improved scroll locking                                                                                         | **Feature**  | [#1449][] |
| Update Billing Address Form to show additional fields                                                           |  **Update**  | [#1286][] |
| Removed errant debugger statement in tests                                                                      |  **Update**  | [#1353][] |
| Updated feathericons to 2.0.x                                                                                   |  **Update**  | [#1416][] |
| Updated `webpack-bundle-analyzer` dependency                                                                    |  **Update**  | [#1466][] |
| Added insecure flag to GraphQL schema validation                                                                |  **Update**  | [#1313][] |
| Refactored the create account form                                                                              | **Refactor** | [#835][]  |
| Refactored templates to allow branded first renders                                                             | **Refactor** | [#1275][] |
| Added a name property for the search trigger button to improve accessibility                                    | **Refactor** | [#1395][] |
| Refactored MiniCart components into functions from classes                                                      | **Refactor** | [#1266][] |
| Refactored Product Details component to use hooks                                                               | **Refactor** | [#1240][] |
| Refactored the Header component into a function                                                                 | **Refactor** | [#1241][] |
| Refactored `create-account` route to use `appShell` to get provided requisite properties                        | **Refactor** | [#1430][] |
| Refactored Checkout components to use hooks, fix bugs, and split code into functional components                | **Refactor** | [#1309][] |
| Refactored Category RootComponent into functional components and use hooks                                      | **Refactor** | [#1211][] |
| Refactored driver usage to improve Venia portability                                                            | **Refactor** | [#1217][] |
| Refactored slide filter UX to make it behave like the nav menu                                                  | **Refactor** | [#1471][] |
| Refactored the edit steps out of redux and into local checkout state                                            | **Refactor** | [#1338][] |
| Removed root-relative imports from Venia code                                                                   | **Refactor** | [#1497][] |
| Moved the majority of Venia components into a separate UI library                                               | **Refactor** | [#1499][] |
| Refactored left drawer components to use hooks, improve performance, and clean up the UI                        | **Refactor** | [#1552][] |
| Refactored image tags to utilize `srcset` and `sizes` for optimized images                                      | **Refactor** | [#1584][] |
| Fixed the order ID being displayed incorrectly                                                                  |  **Bugfix**  | [#1249][] |
| Removed duplicate search icon during load                                                                       |  **Bugfix**  | [#1274][] |
| Fixed a bug that prevented the loading of JS resources from root                                                |  **Bugfix**  | [#1257][] |
| Fixed a bug that reloaded the cart twice when the last item is removed                                          |  **Bugfix**  | [#1230][] |
| Fixed a bug that created an infinite loop when a product is out of stock                                        |  **Bugfix**  | [#1229][] |
| Fixed a bug that allowed the submission of undefined search queries                                             |  **Bugfix**  | [#1363][] |
| Fixed the continue shopping button background color and hover color                                         |  **Bugfix**  | [#1264][] |
| Fixed the spacing between image and title on the product list page                                              |  **Bugfix**  | [#1364][] |
| Fixed the warning about export `loadingIndicator` not being found during build                                  |  **Bugfix**  | [#1391][] |
| Fixed a bug that made Webpack fail on missing modules                                                           |  **Bugfix**  | [#1388][] |
| Fixed a bug that displayed the search suggestion box when there are no results                                  |  **Bugfix**  | [#1252][] |
| Fixed a bug that caused CSS font to block rendering                                                             |  **Bugfix**  | [#1196][] |
| Fixed bug that prevented the Braintree dropin from lazy loading                                                 |  **Bugfix**  | [#1419][] |
| Fixed a bug that caused a tooltips memory leak on mobile                                                        |  **Bugfix**  | [#1288][] |
| Fixed a bug where suspense temporarily loads a fallback component while the SearchBar component is being loaded |  **Bugfix**  | [#1351][] |
| Fixed product page image jutter                                                                                 |  **Bugfix**  | [#1478][] |
| Fixed bug that allowed a signed in customer to access the create account page                                   |  **Bugfix**  | [#1559][] |
| Fixed a bug that prevented the cart counter from persisting after reload                                        |  **Bugfix**  | [#1556][] |
| Fixed handling of head and meta tags                                                                            |  **Bugfix**  | [#1537][] |
| Fixed test config                                                                                               |  **Bugfix**  | [#1606][] |
| Fixed a bug where `Image` isLoaded state was incorrectly being set to `false`                                   |  **Bugfix**  | [#1618][] |
| Fixed missing import of `catalogActions` when clearing filters                                                  |  **Bugfix**  | [#1626][] |
| Fixed a bug that prevented the logo from loading when using `upward-php`                                        |  **Bugfix**  | [#1637][] |

### Peregrine library

| Description                                                                | Change type  |    PR     |
| :------------------------------------------------------------------------- | :----------: | :-------: |
| Added a window size hook                                                   | **Feature**  | [#1193][] |
| Added Toast feature                                                        | **Feature**  | [#1218][] |
| Added eslint plugin for react hooks                                        | **Feature**  | [#1358][] |
| Added a `withLogger` util function for `useReducer`                        | **Feature**  | [#1374][] |
| Added a REST API Hook                                                      | **Feature**  | [#1321][] |
| Added a Peregrine context provider                                         | **Feature**  | [#1316][] |
| Added support for List initial selections                                  | **Feature**  | [#1589][] |
| Removed Storybook from peregrine and update references                     |  **Update**  | [#1482][] |
| Changed prop type of `uniqueID` for list Item component                    |  **Update**  | [#1586][] |
| Refactored the image carousel component into hooks and visual components   | **Refactor** | [#1268][] |
| Refactored list components to use hooks                                    | **Refactor** | [#1515][] |
| Fixed a bug that caused a pagination double fetch                          |  **Bugfix**  | [#1381][] |
| Fixed peregrine watcher and watch:all                                      |  **Bugfix**  | [#1378][] |
| Fixed ApolloContext hook                                                   |  **Bugfix**  | [#1467][] |
| Fixed bug in MagentoRouteHandler so it can correctly handle unknown routes |  **Bugfix**  | [#1495][] |

### Build tools

| Description                                                         | Change type |    PR     |
| :------------------------------------------------------------------ | :---------: | :-------: |
| Added tools for a unified system of environment-based configuration | **Feature** | [#1224][] |
| Added feature to allow GraphQL playground to autodetect queries     | **Feature** | [#1219][] |
| Added Webpack configuration utility                                 | **Feature** | [#1498][] |
| Added Webpack HTML Plugin to generate HTML at compile               | **Feature** | [#1595][] |
| Replaced `cheap-source-map` with `eval-source-map` for devtool      | **Update**  | [#1581][] |
| Removed errant debugger statement in test file                      | **Bugfix**  | [#1572][] |

### Documentation

| Description                                                              |    Change type    |    PR     |
| :----------------------------------------------------------------------- | :---------------: | :-------: |
| Added topic for deploying a storefront to the Magento Cloud              | **Documentation** | [#1232][] |
| Create `usePagination()` hook docs                                       | **Documentation** | [#1461][] |
| Created environment variables documentation                              | **Documentation** | [#1566][] |
| Created Toasts reference docs                                            | **Documentation** | [#1574][] |
| Create architecture overview topics                                      | **Documentation** | [#1538][] |
| Added Google Tag manager for analytics                                   |    **Feature**    | [#1450][] |
| Added ability to search across all DevDocs documentation sites           |    **Feature**    | [#1280][] |
| Added product diagrams to relevant topics                                |    **Feature**    | [#1360][] |
| Embeded codesandbox examples to some reference topics                    |    **Feature**    | [#1417][] |
| Updated docs project dependencies                                        |    **Update**     | [#1234][] |
| Bumped `lodash` version from 4.17.11 to 4.17.14 in `pwa-devdocs`         |    **Update**     | [#1434][] |
| Updated Venia Setup steps                                                |    **Update**     | [#1458][] |
| Updated `useWindowSize()` docs                                           |    **Update**     | [#1457][] |
| Updated the modular components docs                                      |    **Update**     | [#1439][] |
| Update devdocs project dependencies                                      |    **Update**     | [#1437][] |
| Updated Venia Setup steps                                                |    **Update**     | [#1427][] |
| Updated the `axios` dependency version                                   |    **Update**     | [#1352][] |
| Updated usage of UI Component                                            |    **Update**     | [#1462][] |
| Added site migration banner (pre migration)                              |    **Update**     | [#1493][] |
| Restored doc site banner's original content (post migration)             |    **Update**     | [#1506][] |
| Updated repository references after the migration                        |    **Update**     | [#1511][] |
| Updated link to point to files in `develop` instead of `master`          |    **Update**     | [#1560][] |
| Revised `useEventListener()` doc blocks                                  |   **Refactor**    | [#1442][] |
| Revised configuration management draft                                   |   **Refactor**    | [#1435][] |
| Rewrote Peregrine Overview page                                          |   **Refactor**    | [#1376][] |
| Improved Tutorial page discoverability and content                       |   **Refactor**    | [#1292][] |
| Fixed the an issue that created 404 links for 'Edit this page on GitHub' |    **Bugfix**     | [#1302][] |
| Removed broken links                                                     |    **Bugfix**     | [#1238][] |
| Fixed links in the “Contributing” section                                |    **Bugfix**     | [#1557][] |
| Fixed link in Contributing page                                          |    **Bugfix**     | [#1571][] |

### Misc

| Description                                                                                | Change type  |    PR     |
| :----------------------------------------------------------------------------------------- | :----------: | :-------: |
| Refactored Peregrine package and added babel preset                                        | **Feature**  | [#1404][] |
| Bumped `lodash` version from 4.17.11 to 4.17.14 in `docker` project                        |  **Update**  | [#1436][] |
| Added a `publishConfig` property to the `graphql-cli-validate-magento-pwa-queries` package |  **Update**  | [#1424][] |
| Merged `master` branch changes to `develop`                                                |  **Update**  | [#1392][] |
| Added `dangerfile.js` to list of files to ignore                                           |  **Update**  | [#1307][] |
| Updated the PR template for danger checks and updated danger                               |  **Update**  | [#1269][] |
| Removed repetitive section from PR template                                                |  **Update**  | [#1372][] |
| Updated `js-yaml` dependency to 3.13.1                                                     |  **Update**  | [#1464][] |
| Updated project to use less restrictive version                                            |  **Update**  | [#1480][] |
| Updated `now.json` alias to avoid collisions                                               |  **Update**  | [#1522][] |
| Added `publishConfig` keys to upward-spec and upward-js                                    |  **Update**  | [#1544][] |
| Removed version checklist from pr template                                                 |  **Update**  | [#1567][] |
| Updated dependencies to react@~16.9.0                                                      |  **Update**  | [#1564][] |
| Updated GraphQL Yarn lock                                                                  |  **Update**  | [#1629][] |
| Removed Now.sh pipeline                                                                    |  **Update**  | [#1575][] |
| Bumped `eslint-utils` from 1.4.0 to 1.4.2                                                  |  **Update**  | [#1640][] |
| Fixed filename casing inconsistency                                                        | **Refactor** | [#1304][] |
| Simplified the creation and consumption of image URLs                                      | **Refactor** | [#1213][] |
| Fixed `develop` branch deployment on AWS                                                   |  **Bugfix**  | [#1444][] |

## Upgrading from a previous version

The method for updating to 4.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
The following are common use cases we have identified and how to update the project code.

### PWA Studio fork

Many PWA Studio users have forked the PWA Studio Git repository.
Even though their codebase may have diverged a great deal from the current codebase, there is still a Git relationship.

#### Upgrade method: Update using Git

_Pull_ and _Merge_ the changes from the upstream repository using Git.
Most of the conflicts will be in components that we have fully refactored.

We recommend merging the library code we changed and updating component calls with any new prop signatures introduced in this version.

### Manual code copies

Some PWA Studio users have copied parts of the code into their own projects.
This is similar to the Git workflow, but without the merging tools Git provides.

#### Upgrade method: Manual copy updates

Updating this code involves manually copying updates for the code they use.
New code may also need to be copied over if the updated code depends on it.

This method can be a chore, and we hope that some of the features in 4.0.0 will help these users migrate to a package management approach.

### NPM packages

Some users have imported the PWA Studio libraries using NPM.
This is the easiest way to work with the released versions of PWA Studio.

#### Upgrade method: Update `package.json`

To upgrade to 4.0.0, update the project's `package.json` file and change the dependency version for PWA Studio.

[pwa studio releases]: https://github.com/magento/pwa-studio/releases
[client side caching topic]: https://pwastudio.io/technologies/basic-concepts/client-side-caching/
[`venia-upward.yml`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-concept/venia-upward.yml
[hello upward]: https://pwastudio.io/tutorials/hello-upward/simple-server/
[magento compatibility table]: https://pwastudio.io/technologies/magento-compatibility/
[react hooks]: https://reactjs.org/docs/hooks-intro.html
[#835]: https://github.com/magento/pwa-studio/pull/835
[#1234]: https://github.com/magento/pwa-studio/pull/1234
[#1242]: https://github.com/magento/pwa-studio/pull/1242
[#1249]: https://github.com/magento/pwa-studio/pull/1249
[#1193]: https://github.com/magento/pwa-studio/pull/1193
[#1274]: https://github.com/magento/pwa-studio/pull/1274
[#797]: https://github.com/magento/pwa-studio/pull/797
[#1218]: https://github.com/magento/pwa-studio/pull/1218
[#1257]: https://github.com/magento/pwa-studio/pull/1257
[#1230]: https://github.com/magento/pwa-studio/pull/1230
[#1229]: https://github.com/magento/pwa-studio/pull/1229
[#1302]: https://github.com/magento/pwa-studio/pull/1302
[#1363]: https://github.com/magento/pwa-studio/pull/1363
[#1264]: https://github.com/magento/pwa-studio/pull/1264
[#1364]: https://github.com/magento/pwa-studio/pull/1364
[#1358]: https://github.com/magento/pwa-studio/pull/1358
[#1275]: https://github.com/magento/pwa-studio/pull/1275
[#1391]: https://github.com/magento/pwa-studio/pull/1391
[#1388]: https://github.com/magento/pwa-studio/pull/1388
[#1252]: https://github.com/magento/pwa-studio/pull/1252
[#1374]: https://github.com/magento/pwa-studio/pull/1374
[#1395]: https://github.com/magento/pwa-studio/pull/1395
[#1304]: https://github.com/magento/pwa-studio/pull/1304
[#1436]: https://github.com/magento/pwa-studio/pull/1436
[#1434]: https://github.com/magento/pwa-studio/pull/1434
[#1424]: https://github.com/magento/pwa-studio/pull/1424
[#1450]: https://github.com/magento/pwa-studio/pull/1450
[#1268]: https://github.com/magento/pwa-studio/pull/1268
[#1280]: https://github.com/magento/pwa-studio/pull/1280
[#1286]: https://github.com/magento/pwa-studio/pull/1286
[#1444]: https://github.com/magento/pwa-studio/pull/1444
[#1458]: https://github.com/magento/pwa-studio/pull/1458
[#1457]: https://github.com/magento/pwa-studio/pull/1457
[#1442]: https://github.com/magento/pwa-studio/pull/1442
[#1439]: https://github.com/magento/pwa-studio/pull/1439
[#1381]: https://github.com/magento/pwa-studio/pull/1381
[#1437]: https://github.com/magento/pwa-studio/pull/1437
[#1435]: https://github.com/magento/pwa-studio/pull/1435
[#1427]: https://github.com/magento/pwa-studio/pull/1427
[#1360]: https://github.com/magento/pwa-studio/pull/1360
[#1417]: https://github.com/magento/pwa-studio/pull/1417
[#1376]: https://github.com/magento/pwa-studio/pull/1376
[#1392]: https://github.com/magento/pwa-studio/pull/1392
[#1321]: https://github.com/magento/pwa-studio/pull/1321
[#1352]: https://github.com/magento/pwa-studio/pull/1352
[#1266]: https://github.com/magento/pwa-studio/pull/1266
[#1353]: https://github.com/magento/pwa-studio/pull/1353
[#1292]: https://github.com/magento/pwa-studio/pull/1292
[#1224]: https://github.com/magento/pwa-studio/pull/1224
[#1307]: https://github.com/magento/pwa-studio/pull/1307
[#1267]: https://github.com/magento/pwa-studio/pull/1267
[#1240]: https://github.com/magento/pwa-studio/pull/1240
[#1232]: https://github.com/magento/pwa-studio/pull/1232
[#1241]: https://github.com/magento/pwa-studio/pull/1241
[#1238]: https://github.com/magento/pwa-studio/pull/1238
[#1196]: https://github.com/magento/pwa-studio/pull/1196
[#1416]: https://github.com/magento/pwa-studio/pull/1416
[#1430]: https://github.com/magento/pwa-studio/pull/1430
[#1404]: https://github.com/magento/pwa-studio/pull/1404
[#1419]: https://github.com/magento/pwa-studio/pull/1419
[#1361]: https://github.com/magento/pwa-studio/pull/1361
[#1309]: https://github.com/magento/pwa-studio/pull/1309
[#1288]: https://github.com/magento/pwa-studio/pull/1288
[#1269]: https://github.com/magento/pwa-studio/pull/1269
[#1372]: https://github.com/magento/pwa-studio/pull/1372
[#1351]: https://github.com/magento/pwa-studio/pull/1351
[#1378]: https://github.com/magento/pwa-studio/pull/1378
[#1449]: https://github.com/magento/pwa-studio/pull/1449
[#1466]: https://github.com/magento/pwa-studio/pull/1466
[#1464]: https://github.com/magento/pwa-studio/pull/1464
[#1316]: https://github.com/magento/pwa-studio/pull/1316
[#1313]: https://github.com/magento/pwa-studio/pull/1313
[#1211]: https://github.com/magento/pwa-studio/pull/1211
[#1462]: https://github.com/magento/pwa-studio/pull/1462
[#1213]: https://github.com/magento/pwa-studio/pull/1213
[#1219]: https://github.com/magento/pwa-studio/pull/1219
[#1217]: https://github.com/magento/pwa-studio/pull/1217
[#1467]: https://github.com/magento/pwa-studio/pull/1467
[#1461]: https://github.com/magento/pwa-studio/pull/1461
[#1471]: https://github.com/magento/pwa-studio/pull/1471
[#1338]: https://github.com/magento/pwa-studio/pull/1338
[#1482]: https://github.com/magento/pwa-studio/pull/1482
[#1478]: https://github.com/magento/pwa-studio/pull/1478
[#1493]: https://github.com/magento/pwa-studio/pull/1493
[#1480]: https://github.com/magento/pwa-studio/pull/1480
[#1506]: https://github.com/magento/pwa-studio/pull/1506
[#1349]: https://github.com/magento/pwa-studio/pull/1349
[#1514]: https://github.com/magento/pwa-studio/pull/1514
[#1511]: https://github.com/magento/pwa-studio/pull/1511
[#1522]: https://github.com/magento/pwa-studio/pull/1522
[#1498]: https://github.com/magento/pwa-studio/pull/1498
[#1497]: https://github.com/magento/pwa-studio/pull/1497
[#1544]: https://github.com/magento/pwa-studio/pull/1544
[#1499]: https://github.com/magento/pwa-studio/pull/1499
[#1495]: https://github.com/magento/pwa-studio/pull/1495
[#1559]: https://github.com/magento/pwa-studio/pull/1559
[#1567]: https://github.com/magento/pwa-studio/pull/1567
[#1560]: https://github.com/magento/pwa-studio/pull/1560
[#1564]: https://github.com/magento/pwa-studio/pull/1564
[#1557]: https://github.com/magento/pwa-studio/pull/1557
[#1556]: https://github.com/magento/pwa-studio/pull/1556
[#1537]: https://github.com/magento/pwa-studio/pull/1537
[#1572]: https://github.com/magento/pwa-studio/pull/1572
[#1566]: https://github.com/magento/pwa-studio/pull/1566
[#1515]: https://github.com/magento/pwa-studio/pull/1515
[#1571]: https://github.com/magento/pwa-studio/pull/1571
[#1581]: https://github.com/magento/pwa-studio/pull/1581
[#1586]: https://github.com/magento/pwa-studio/pull/1586
[#1574]: https://github.com/magento/pwa-studio/pull/1574
[#1606]: https://github.com/magento/pwa-studio/pull/1606
[#1589]: https://github.com/magento/pwa-studio/pull/1589
[#1595]: https://github.com/magento/pwa-studio/pull/1595
[#1629]: https://github.com/magento/pwa-studio/pull/1629
[#1538]: https://github.com/magento/pwa-studio/pull/1538
[#1618]: https://github.com/magento/pwa-studio/pull/1618
[#1552]: https://github.com/magento/pwa-studio/pull/1552
[#1626]: https://github.com/magento/pwa-studio/pull/1626
[#1637]: https://github.com/magento/pwa-studio/pull/1637
[#1584]: https://github.com/magento/pwa-studio/pull/1584
[#1575]: https://github.com/magento/pwa-studio/pull/1575
[#1640]: https://github.com/magento/pwa-studio/pull/1640
