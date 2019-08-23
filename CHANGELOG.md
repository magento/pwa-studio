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

* [Toast hooks][] and [ToastContainer][] - Provide logic for managing toast messages and a container for displaying these messages.
* [`useWindowSize()`][] - A hook that provides window size data and lets you respond to window resizing events.
* [`useRestApi()`][] and [`useRestResponse()`][] - Hooks that expose the API for sending REST calls and handling the response.
* [`useScrollLock()`][] - Hook that gives the ability to lock the `document` element.
* [`usePagination()`][] - A hook that provides pagination logic for components that need to navigate through paged data.
* [`useEventListener()`][] - A hook that gives the ability to add a callback function when an event is triggered on an element.
* [`useCarousel()`][] - A hook for interacting with the state for a carousel of images.

[toast hooks]: https://github.com/magento/pwa-studio/tree/develop/packages/peregrine/lib/Toasts
[ToastContainer]: https://github.com/magento/pwa-studio/tree/develop/packages/venia-ui/lib/components/ToastContainer
[`useWindowSize()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useWindowSize.js
[`useRestApi()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useRestApi.js
[`useRestResponse()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useRestResponse.js
[`useScrollLock()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useScrollLock.js 
[`usePagination()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/usePagination.js
[`useEventListener()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useEventListener.js
[`useCarousel()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useCarousel.js

#### Component refactors

This release includes code refactors to existing components.
The main purpose for this refactor is to extract the logic from these components and convert them into re-useable Peregrine hooks, such as `useCarousel()` and `useScrollLock()`.
Another reason for refactoring some of these components is to convert them into functional components.

The list of refactored components in this release include:

* **List**, **List Items**, and **List Item** in Peregrine
* **Category** in RootComponent
* **Header**, **Checkout**, **MiniCart**, **Image**, and **ProductFullDetail** in Venia
* Various left drawer components (See PR [#1552][] for the full list of affected components)

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

* Generating SSL certificates
* Creating a `.env` file
* Loading and validating a project's `.env` file.

See PR [#1498][]

**`configureWebpack()`** - A function that provides an opinionated configuration for Webpack.
This replaces a large portion of the `webpack.config.js` file in the Venia project in favor of a configurable utility that can be used in other storefront projects.

**`babel-preset-peregrine`** - A new package that defines a preset for Babel.
This preset is required for storefronts using Peregrine and Venia-UI components.
See PR [#1404][].

## Pull requests merged in this release

| Description                                                                        |    Change type    |    PR     |
| :--------------------------------------------------------------------------------- | :---------------: | :-------: |
| \[bug]: Incorrect Order Id Displayed - Replacing functionality                     |    **Bugfix**     | [#1249][] |
| fix(header): Remove double searchicon at load. Fixes #1273.                        |    **Bugfix**     | [#1274][] |
| feature: Layered Navigation (Filters)                                              |    **Feature**    | [#797][]  |
| \[feature]: Toasts                                                                 |    **Feature**    | [#1218][] |
| Product Out of Stock Message                                                       |       **-**       | [#1229][] |
| \[BUGFIX] Solved 404 links for 'Edit this page on GitHub'                          |       **-**       | [#1302][] |
| 1330: Add spacing between image and title on PLP                                   |       **-**       | [#1364][] |
| enhancement(load): Branded first renders                                           |       **-**       | [#1275][] |
| Peregrine: Refactoring image carousel component for peregrine                      |   **Refactor**    | [#1268][] |
| \[docs]: Add federated search to docs                                              | **Documentation** | [#1280][] |
| bug: fix pagination double fetch                                                   |    **Bugfix**     | [#1381][] |
| Update Venia setup steps                                                           |       **-**       | [#1427][] |
| \[doc] add product diagrams                                                        | **Documentation** | [#1360][] |
| Embed codesandbox examples                                                         |       **-**       | [#1417][] |
| \[doc] Rewrite Peregrine Overview page                                             | **Documentation** | [#1376][] |
| MiniCart Refactor                                                                  |   **Refactor**    | [#1266][] |
| Tutorial page improvements                                                         |       **-**       | [#1292][] |
| Generate optimized Image URLs using configuration from GraphQL                     |       **-**       | [#1267][] |
| Product Details Component to Hooks                                                 |       **-**       | [#1240][] |
| Refactor Header component to function                                              |   **Refactor**    | [#1241][] |
| bug: Make css-font non render-blocking                                             |       **-**       | [#1196][] |
| Refactor create-account route to use appShell to get provided requisite properties |   **Refactor**    | [#1430][] |
| \[feature]: Add height to \`makeUrl\` and enforce crop in middleware if provided   |    **Feature**    | [#1361][] |
| bug: Fix peregrine watcher and watch:all                                           |    **Bugfix**     | [#1378][] |
| Improve scroll locking                                                             |       **-**       | [#1449][] |
| Wrapped Peregrine Context Provider Component                                       |       **-**       | [#1316][] |
| Category RootComponent Simple Re-Factor                                            |   **Refactor**    | [#1211][] |
| \[doc] Update usage of UI Component                                                | **Documentation** | [#1462][] |
| Refactor driver usage to improve Venia portability                                 |   **Refactor**    | [#1217][] |
| \[doc] usePagination hook docs                                                     | **Documentation** | [#1461][] |
| \[bug]: Incorrect Order Id Displayed - Replacing functionality                     |    **Bugfix**     | [#1249][] |
| fix(header): Remove double searchicon at load. Fixes #1273.                        |    **Bugfix**     | [#1274][] |
| feature: Layered Navigation (Filters)                                              |    **Feature**    | [#797][]  |
| \[feature]: Toasts                                                                 |    **Feature**    | [#1218][] |
| Product Out of Stock Message                                                       |       **-**       | [#1229][] |
| \[BUGFIX] Solved 404 links for 'Edit this page on GitHub'                          |       **-**       | [#1302][] |
| 1330: Add spacing between image and title on PLP                                   |       **-**       | [#1364][] |
| enhancement(load): Branded first renders                                           |       **-**       | [#1275][] |
| Peregrine: Refactoring image carousel component for peregrine                      |   **Refactor**    | [#1268][] |
| \[docs]: Add federated search to docs                                              | **Documentation** | [#1280][] |
| bug: fix pagination double fetch                                                   |    **Bugfix**     | [#1381][] |
| Update Venia setup steps                                                           |       **-**       | [#1427][] |
| \[doc] add product diagrams                                                        | **Documentation** | [#1360][] |
| Embed codesandbox examples                                                         |       **-**       | [#1417][] |
| \[doc] Rewrite Peregrine Overview page                                             | **Documentation** | [#1376][] |
| MiniCart Refactor                                                                  |   **Refactor**    | [#1266][] |
| Tutorial page improvements                                                         |       **-**       | [#1292][] |
| Generate optimized Image URLs using configuration from GraphQL                     |       **-**       | [#1267][] |
| Product Details Component to Hooks                                                 |       **-**       | [#1240][] |
| Refactor Header component to function                                              |   **Refactor**    | [#1241][] |
| bug: Make css-font non render-blocking                                             |       **-**       | [#1196][] |
| Refactor create-account route to use appShell to get provided requisite properties |   **Refactor**    | [#1430][] |
| \[feature]: Add height to \`makeUrl\` and enforce crop in middleware if provided   |    **Feature**    | [#1361][] |
| bug: Fix peregrine watcher and watch:all                                           |    **Bugfix**     | [#1378][] |
| Improve scroll locking                                                             |       **-**       | [#1449][] |
| Wrapped Peregrine Context Provider Component                                       |       **-**       | [#1316][] |
| Category RootComponent Simple Re-Factor                                            |   **Refactor**    | [#1211][] |
| \[doc] Update usage of UI Component                                                | **Documentation** | [#1462][] |
| Refactor driver usage to improve Venia portability                                 |   **Refactor**    | [#1217][] |
| \[doc] usePagination hook docs                                                     | **Documentation** | [#1461][] |
| \[bug]: Incorrect Order Id Displayed - Replacing functionality                     |    **Bugfix**     | [#1249][] |
| fix(header): Remove double searchicon at load. Fixes #1273.                        |    **Bugfix**     | [#1274][] |
| feature: Layered Navigation (Filters)                                              |    **Feature**    | [#797][]  |
| \[feature]: Toasts                                                                 |    **Feature**    | [#1218][] |
| Product Out of Stock Message                                                       |       **-**       | [#1229][] |
| \[BUGFIX] Solved 404 links for 'Edit this page on GitHub'                          |       **-**       | [#1302][] |
| enhancement(load): Branded first renders                                           |       **-**       | [#1275][] |
| Peregrine: Refactoring image carousel component for peregrine                      |   **Refactor**    | [#1268][] |
| \[docs]: Add federated search to docs                                              | **Documentation** | [#1280][] |
| bug: fix pagination double fetch                                                   |    **Bugfix**     | [#1381][] |
| Update Venia setup steps                                                           |       **-**       | [#1427][] |
| \[doc] add product diagrams                                                        | **Documentation** | [#1360][] |
| Embed codesandbox examples                                                         |       **-**       | [#1417][] |
| \[doc] Rewrite Peregrine Overview page                                             | **Documentation** | [#1376][] |
| MiniCart Refactor                                                                  |   **Refactor**    | [#1266][] |
| Tutorial page improvements                                                         |       **-**       | [#1292][] |
| Generate optimized Image URLs using configuration from GraphQL                     |       **-**       | [#1267][] |
| Product Details Component to Hooks                                                 |       **-**       | [#1240][] |
| Refactor Header component to function                                              |   **Refactor**    | [#1241][] |
| \[feature]: Add height to \`makeUrl\` and enforce crop in middleware if provided   |    **Feature**    | [#1361][] |
| Improve scroll locking                                                             |       **-**       | [#1449][] |
| Category RootComponent Simple Re-Factor                                            |   **Refactor**    | [#1211][] |
| \[doc] Update usage of UI Component                                                | **Documentation** | [#1462][] |
| Refactor driver usage to improve Venia portability                                 |   **Refactor**    | [#1217][] |
| \[doc] usePagination hook docs                                                     | **Documentation** | [#1461][] |
| \[ux]: Slide filter from side and restrict width                                   |       **-**       | [#1471][] |
| bug: fix pdp image jutter                                                          |    **Bugfix**     | [#1478][] |
| Add migration banner                                                               |       **-**       | [#1493][] |
| MagentoRouteHandler: correct handling of unknown routes                            |       **-**       | [#1495][] |
| Fixed issue #1549 Signed in customer access to create account page                 |    **Bugfix**     | [#1559][] |
| \[bug]: Incorrect Order Id Displayed - Replacing functionality                     |    **Bugfix**     | [#1249][] |
| fix(header): Remove double searchicon at load. Fixes #1273.                        |    **Bugfix**     | [#1274][] |
| feature: Layered Navigation (Filters)                                              |    **Feature**    | [#797][]  |
| \[feature]: Toasts                                                                 |    **Feature**    | [#1218][] |
| Product Out of Stock Message                                                       |       **-**       | [#1229][] |
| \[BUGFIX] Solved 404 links for 'Edit this page on GitHub'                          |       **-**       | [#1302][] |
| enhancement(load): Branded first renders                                           |       **-**       | [#1275][] |
| Bump lodash from 4.17.11 to 4.17.14 in /docker                                     |       **-**       | [#1436][] |
| \[docs]: Add federated search to docs                                              | **Documentation** | [#1280][] |
| bug: fix pagination double fetch                                                   |    **Bugfix**     | [#1381][] |
| Update Venia setup steps                                                           |       **-**       | [#1427][] |
| \[doc] add product diagrams                                                        | **Documentation** | [#1360][] |
| Embed codesandbox examples                                                         |       **-**       | [#1417][] |
| \[doc] Rewrite Peregrine Overview page                                             | **Documentation** | [#1376][] |
| MiniCart Refactor                                                                  |   **Refactor**    | [#1266][] |
| Tutorial page improvements                                                         |       **-**       | [#1292][] |
| Generate optimized Image URLs using configuration from GraphQL                     |       **-**       | [#1267][] |
| Product Details Component to Hooks                                                 |       **-**       | [#1240][] |
| Refactor Header component to function                                              |   **Refactor**    | [#1241][] |
| Refactor create-account route to use appShell to get provided requisite properties |   **Refactor**    | [#1430][] |
| \[feature]: Add height to \`makeUrl\` and enforce crop in middleware if provided   |    **Feature**    | [#1361][] |
| Category RootComponent Simple Re-Factor                                            |   **Refactor**    | [#1211][] |
| \[doc] Update usage of UI Component                                                | **Documentation** | [#1462][] |
| Refactor driver usage to improve Venia portability                                 |   **Refactor**    | [#1217][] |
| bug: fix pdp image jutter                                                          |    **Bugfix**     | [#1478][] |
| V4P2: feat(buildpack): Add Webpack configurator facade                             |       **-**       | [#1498][] |
| Cart Counter                                                                       |       **-**       | [#1556][] |

## Updating from 3.0.0

The method for updating to 4.0.0 from 3.0.0 depends on how PWA Studio is incorporated into your project.
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

[#1249]: https://github.com/magento/pwa-studio/pull/1249
[#1274]: https://github.com/magento/pwa-studio/pull/1274
[#797]: https://github.com/magento/pwa-studio/pull/797
[#1218]: https://github.com/magento/pwa-studio/pull/1218
[#1229]: https://github.com/magento/pwa-studio/pull/1229
[#1302]: https://github.com/magento/pwa-studio/pull/1302
[#1364]: https://github.com/magento/pwa-studio/pull/1364
[#1275]: https://github.com/magento/pwa-studio/pull/1275
[#1268]: https://github.com/magento/pwa-studio/pull/1268
[#1280]: https://github.com/magento/pwa-studio/pull/1280
[#1381]: https://github.com/magento/pwa-studio/pull/1381
[#1427]: https://github.com/magento/pwa-studio/pull/1427
[#1360]: https://github.com/magento/pwa-studio/pull/1360
[#1417]: https://github.com/magento/pwa-studio/pull/1417
[#1376]: https://github.com/magento/pwa-studio/pull/1376
[#1266]: https://github.com/magento/pwa-studio/pull/1266
[#1292]: https://github.com/magento/pwa-studio/pull/1292
[#1267]: https://github.com/magento/pwa-studio/pull/1267
[#1240]: https://github.com/magento/pwa-studio/pull/1240
[#1241]: https://github.com/magento/pwa-studio/pull/1241
[#1196]: https://github.com/magento/pwa-studio/pull/1196
[#1430]: https://github.com/magento/pwa-studio/pull/1430
[#1361]: https://github.com/magento/pwa-studio/pull/1361
[#1378]: https://github.com/magento/pwa-studio/pull/1378
[#1449]: https://github.com/magento/pwa-studio/pull/1449
[#1316]: https://github.com/magento/pwa-studio/pull/1316
[#1211]: https://github.com/magento/pwa-studio/pull/1211
[#1462]: https://github.com/magento/pwa-studio/pull/1462
[#1217]: https://github.com/magento/pwa-studio/pull/1217
[#1461]: https://github.com/magento/pwa-studio/pull/1461
[#1249]: https://github.com/magento/pwa-studio/pull/1249
[#1274]: https://github.com/magento/pwa-studio/pull/1274
[#797]: https://github.com/magento/pwa-studio/pull/797
[#1218]: https://github.com/magento/pwa-studio/pull/1218
[#1229]: https://github.com/magento/pwa-studio/pull/1229
[#1302]: https://github.com/magento/pwa-studio/pull/1302
[#1364]: https://github.com/magento/pwa-studio/pull/1364
[#1275]: https://github.com/magento/pwa-studio/pull/1275
[#1268]: https://github.com/magento/pwa-studio/pull/1268
[#1280]: https://github.com/magento/pwa-studio/pull/1280
[#1381]: https://github.com/magento/pwa-studio/pull/1381
[#1427]: https://github.com/magento/pwa-studio/pull/1427
[#1360]: https://github.com/magento/pwa-studio/pull/1360
[#1417]: https://github.com/magento/pwa-studio/pull/1417
[#1376]: https://github.com/magento/pwa-studio/pull/1376
[#1266]: https://github.com/magento/pwa-studio/pull/1266
[#1292]: https://github.com/magento/pwa-studio/pull/1292
[#1267]: https://github.com/magento/pwa-studio/pull/1267
[#1240]: https://github.com/magento/pwa-studio/pull/1240
[#1241]: https://github.com/magento/pwa-studio/pull/1241
[#1196]: https://github.com/magento/pwa-studio/pull/1196
[#1430]: https://github.com/magento/pwa-studio/pull/1430
[#1361]: https://github.com/magento/pwa-studio/pull/1361
[#1378]: https://github.com/magento/pwa-studio/pull/1378
[#1449]: https://github.com/magento/pwa-studio/pull/1449
[#1316]: https://github.com/magento/pwa-studio/pull/1316
[#1211]: https://github.com/magento/pwa-studio/pull/1211
[#1462]: https://github.com/magento/pwa-studio/pull/1462
[#1217]: https://github.com/magento/pwa-studio/pull/1217
[#1461]: https://github.com/magento/pwa-studio/pull/1461
[#1249]: https://github.com/magento/pwa-studio/pull/1249
[#1274]: https://github.com/magento/pwa-studio/pull/1274
[#797]: https://github.com/magento/pwa-studio/pull/797
[#1218]: https://github.com/magento/pwa-studio/pull/1218
[#1229]: https://github.com/magento/pwa-studio/pull/1229
[#1302]: https://github.com/magento/pwa-studio/pull/1302
[#1275]: https://github.com/magento/pwa-studio/pull/1275
[#1268]: https://github.com/magento/pwa-studio/pull/1268
[#1280]: https://github.com/magento/pwa-studio/pull/1280
[#1381]: https://github.com/magento/pwa-studio/pull/1381
[#1427]: https://github.com/magento/pwa-studio/pull/1427
[#1360]: https://github.com/magento/pwa-studio/pull/1360
[#1417]: https://github.com/magento/pwa-studio/pull/1417
[#1376]: https://github.com/magento/pwa-studio/pull/1376
[#1266]: https://github.com/magento/pwa-studio/pull/1266
[#1292]: https://github.com/magento/pwa-studio/pull/1292
[#1267]: https://github.com/magento/pwa-studio/pull/1267
[#1240]: https://github.com/magento/pwa-studio/pull/1240
[#1241]: https://github.com/magento/pwa-studio/pull/1241
[#1361]: https://github.com/magento/pwa-studio/pull/1361
[#1449]: https://github.com/magento/pwa-studio/pull/1449
[#1211]: https://github.com/magento/pwa-studio/pull/1211
[#1462]: https://github.com/magento/pwa-studio/pull/1462
[#1217]: https://github.com/magento/pwa-studio/pull/1217
[#1461]: https://github.com/magento/pwa-studio/pull/1461
[#1471]: https://github.com/magento/pwa-studio/pull/1471
[#1478]: https://github.com/magento/pwa-studio/pull/1478
[#1493]: https://github.com/magento/pwa-studio/pull/1493
[#1495]: https://github.com/magento/pwa-studio/pull/1495
[#1559]: https://github.com/magento/pwa-studio/pull/1559
[#1249]: https://github.com/magento/pwa-studio/pull/1249
[#1274]: https://github.com/magento/pwa-studio/pull/1274
[#797]: https://github.com/magento/pwa-studio/pull/797
[#1218]: https://github.com/magento/pwa-studio/pull/1218
[#1229]: https://github.com/magento/pwa-studio/pull/1229
[#1302]: https://github.com/magento/pwa-studio/pull/1302
[#1275]: https://github.com/magento/pwa-studio/pull/1275
[#1436]: https://github.com/magento/pwa-studio/pull/1436
[#1280]: https://github.com/magento/pwa-studio/pull/1280
[#1381]: https://github.com/magento/pwa-studio/pull/1381
[#1427]: https://github.com/magento/pwa-studio/pull/1427
[#1360]: https://github.com/magento/pwa-studio/pull/1360
[#1417]: https://github.com/magento/pwa-studio/pull/1417
[#1376]: https://github.com/magento/pwa-studio/pull/1376
[#1266]: https://github.com/magento/pwa-studio/pull/1266
[#1292]: https://github.com/magento/pwa-studio/pull/1292
[#1267]: https://github.com/magento/pwa-studio/pull/1267
[#1240]: https://github.com/magento/pwa-studio/pull/1240
[#1241]: https://github.com/magento/pwa-studio/pull/1241
[#1430]: https://github.com/magento/pwa-studio/pull/1430
[#1361]: https://github.com/magento/pwa-studio/pull/1361
[#1211]: https://github.com/magento/pwa-studio/pull/1211
[#1462]: https://github.com/magento/pwa-studio/pull/1462
[#1217]: https://github.com/magento/pwa-studio/pull/1217
[#1478]: https://github.com/magento/pwa-studio/pull/1478
[#1498]: https://github.com/magento/pwa-studio/pull/1498
[#1556]: https://github.com/magento/pwa-studio/pull/1556
