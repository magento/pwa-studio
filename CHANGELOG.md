

TODO: Include the following items in future release notes to help with version upgrades

  * A table of the new versions published for individual packages
  * List of updated template files
  * Any updates to environmental variables

-->
# Release 11.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 11.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 11.0.0](#whats-new-in-1100)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Known issues](#known-issues)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 11.0.0

PWA Studio 11.0.0 contains new features, refactors, bug fixes, and various improvements.
This version is compatible with **Magento 2.4.3**.

### Wish List feature

Wish List is a feature introduced in this release and implemented in the Venia storefront template.
It gives shoppers the ability to create and manage lists of items they may want to purchase in the future.

#### Pull Requests

| Description                                                                                                | PR        |
| ---------------------------------------------------------------------------------------------------------- | --------- |
| Removed the use of mock data for Wish List and connected to real GraphQL data                              | [#3041][] |
| Implemented adding an item to a Wish List from the product page                                            | [#3048][] |
| Implemented the ability to edit a Wish List's name and visibility                                          | [#3049][] |
| Implemented adding an item to a Wish List from the category page                                           | [#3105][] |
| Fixed a Wish List bug that prevented you from removing a product if the Wish List had 2 or more products   | [#3121][] |
| Implemented adding an item to a Wish List from the cart                                                    | [#3130][] |
| Implemented adding an item to the cart from a Wish List                                                    | [#3170][] |
| Created a re-usable hook for Wish List logic for re-use in various components                              | [#3182][] |
| Fixed a Wish List bug that allowed users to collapse the Wish List section when it only had a single entry | [#3184][] |
| Implemented adding an item from the cart to multiple wishlists                                             | [#3207][] |
| Added message to display when the Wish List is empty                                                       | [#3228][] |
| Fixed a Wish List bug in the Create Wish List dialog that prevented users from creating a new Wish List    | [#3242][] |
| Created a single Wish List button component to use throughout the application                              | [#3249][] |

[#3242]: https://github.com/magento/pwa-studio/pull/3242
[#3184]: https://github.com/magento/pwa-studio/pull/3184
[#3249]: https://github.com/magento/pwa-studio/pull/3249
[#3228]: https://github.com/magento/pwa-studio/pull/3228
[#3182]: https://github.com/magento/pwa-studio/pull/3182
[#3121]: https://github.com/magento/pwa-studio/pull/3121
[#3207]: https://github.com/magento/pwa-studio/pull/3207
[#3170]: https://github.com/magento/pwa-studio/pull/3170
[#3130]: https://github.com/magento/pwa-studio/pull/3130
[#3105]: https://github.com/magento/pwa-studio/pull/3105
[#3048]: https://github.com/magento/pwa-studio/pull/3048
[#3041]: https://github.com/magento/pwa-studio/pull/3041
[#3049]: https://github.com/magento/pwa-studio/pull/3049
### Cypress tests

[Cypress](https://www.cypress.io/) is an end-to-end testing suite written in JavaScript.
This release adds this framework to the PWA Studio project to increase testing automation and reduce the time spent on manual testing.
This will enable the team to release new versions faster and more often.

#### Pull Requests

| Description                                   | PR        |
| --------------------------------------------- | --------- |
| Configured the project to use Cypress         | [#3082][] |
| Added the Cypress Visual Testing plugin       | [#3136][] |
| Added tests for the Wish List feature         | [#3146][] |
| Added tests for PageBuilder banner component  | [#3178][] |
| Added tests for PageBuilder buttons           | [#3194][] |
| Added tests for multiple Wish Lists           | [#3218][] |
| Updated the Cypress tests directory structure | [#3253][] |

[#3082]: https://github.com/magento/pwa-studio/pull/3082
[#3136]: https://github.com/magento/pwa-studio/pull/3136
[#3146]: https://github.com/magento/pwa-studio/pull/3146
[#3178]: https://github.com/magento/pwa-studio/pull/3178
[#3194]: https://github.com/magento/pwa-studio/pull/3194
[#3218]: https://github.com/magento/pwa-studio/pull/3218
[#3253]: https://github.com/magento/pwa-studio/pull/3253

### Virtual Product types

This release contains initial work to support Virtual Product types.
The current implementation only lets you browse and view Virtual Product types in your storefront.

#### Pull Requests

| Description                                                   | PR        |
| ------------------------------------------------------------- | --------- |
| Implemented ability to browse and view Virtual Products types | [#3052][] |

[#3052]: https://github.com/magento/pwa-studio/pull/3052

### Documentation updates

Since the last release, the documentation site has published new topics and updated an existing topic.

#### New topics

- [Upgrading versions](https://magento.github.io/pwa-studio/technologies/upgrading-versions/)
- [Change static assets directory](https://magento.github.io/pwa-studio/tutorials/intercept-a-target/change-static-assets-directory/)
- [Extension development](https://magento.github.io/pwa-studio/tutorials/extension-development/)
- [Modify code with Targetables](https://magento.github.io/pwa-studio/tutorials/targetables/)
- Targetable API reference
  - [`TargetableModule`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableModule/)
  - [`TargetableESModule`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableESModule/)
  - [`TargetableESModuleArray`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableESModuleArray/)
  - [`TargetableESModuleObject`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableESModuleObject/)
  - [`TargetableReactComponent`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableReactComponent/)
  - [`TargetableSet`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableSet/)
  - [`SingleImportStatement`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/SingleImportStatement/)

#### Updated topics

- [PWA Studio Overview](https://magento.github.io/pwa-studio/technologies/overview/)

#### Pull Requests

| Description                                                                                                            | PR        |
| ---------------------------------------------------------------------------------------------------------------------- | --------- |
| Published a new topic that provides guidance and best practices for upgrading to new versions                          | [#3231][] |
| Published a new tutorial that shows how you can change the static assets directory used in your project                | [#3219][] |
| Reorganize and refactor the navigation for the Overview sections                                                       | [#2926][] |
| Published a new topic that provides general guidance for extension development                                         | [#2995][] |
| Published a new tutorial that provides general guidance for working with Targetables along with a set of API reference | [#2966][] |

[#3231]: https://github.com/magento/pwa-studio/pull/3231
[#3219]: https://github.com/magento/pwa-studio/pull/3219
[#2926]: https://github.com/magento/pwa-studio/pull/2926
[#2995]: https://github.com/magento/pwa-studio/pull/2995
[#2966]: https://github.com/magento/pwa-studio/pull/2966

### Performance updates

This release contains minor performance updates related to compressed HTML requests.

#### Pull Requests

| Description                                                        | PR        |
| ------------------------------------------------------------------ | --------- |
| Configured UPWARD to use `gzip` content encoding for HTML requests | [#3255][] |

[#3255]: https://github.com/magento/pwa-studio/pull/3255

### Bug fixes

The following bugs have been fixed in 11.0.0.

| Description                                                                                                         | PR        |
| ------------------------------------------------------------------------------------------------------------------- | --------- |
| Braintree error related to the use of UK addresses                                                                  | [#3251][] |
| GraphQL bug related to line comments inside the query                                                               | [#3196][] |
| Bug in the filter modal where certain icons would not be visible                                                    | [#3171][] |
| Checkout bug that prevented you from changing your billing address when you pay with Check/Money Order              | [#3239][] |
| Project bug that prevented the installation of dependencies                                                         | [#3106][] |
| Scaffolding bug where the `DEBUG_PROJECT_CREATION` flag does not exclude optional extension packages                | [#3086][] |
| Checkout bug that prevented validation of region codes across different countries                                   | [#3133][] |
| Checkout bug that prevented you from placing another order after the initial order was declined                     | [#3091][] |
| Scaffolding bug that prevented the `yarn build:dev` command working                                                 | [#3047][] |
| Checkout bug where the mobile view of the checkout page would not scroll to the appropriate spot after each step    | [#3055][] |
| Checkout page bug where it would not pick up the region code provided in the cart page under specific circumstances | [#3093][] |

[#3251]: https://github.com/magento/pwa-studio/pull/3251
[#3196]: https://github.com/magento/pwa-studio/pull/3196
[#3171]: https://github.com/magento/pwa-studio/pull/3171
[#3239]: https://github.com/magento/pwa-studio/pull/3239
[#3106]: https://github.com/magento/pwa-studio/pull/3106
[#3086]: https://github.com/magento/pwa-studio/pull/3086
[#3133]: https://github.com/magento/pwa-studio/pull/3133
[#3091]: https://github.com/magento/pwa-studio/pull/3091
[#3047]: https://github.com/magento/pwa-studio/pull/3047
[#3055]: https://github.com/magento/pwa-studio/pull/3055
[#3093]: https://github.com/magento/pwa-studio/pull/3093

### Refactors

| Description                                                                            | PR                  |
| -------------------------------------------------------------------------------------- | ------------------- |
| Moved the `graphql-cli-validate-magento-pwa-queries` package into the `@magento` scope | [#3198]             |
| Remove `window` references from Venia                                                  | [#2991][] [#3087][] |
| Refactored the **Add to Cart** feature to use the generic `AddProductsToCart` mutation | [#3092]             |
| Removed the Adobe Client Data Layer by default for scaffolded projects                 | [#3215]             |

[#3198]: https://github.com/magento/pwa-studio/pull/3198
[#2991]: https://github.com/magento/pwa-studio/pull/2991
[#3087]: https://github.com/magento/pwa-studio/pull/3087
[#3092]: https://github.com/magento/pwa-studio/pull/3092
[#3215]: https://github.com/magento/pwa-studio/pull/3215

## Package versions

The following table lists the latest versions of each package as of 11.0.0.

**Note:**
Some package versions remain the same as in the previous release if there were no changes applied to them.

| Package                         | Latest version |
| ------------------------------- | -------------- |
| `babel-preset-peregrine`        | 1.1.0          |
| `create-pwa`                    | 1.3.0          |
| `upward-security-headers`       | 1.0.3          |
| `venia-adobe-data-layer`        | 1.0.0          |
| `venia-sample-backends`         | 0.0.3          |
| `venia-sample-language-packs`   | 0.0.3          |
| `venia-sample-payments-checkmo` | 0.0.1          |
| `pagebuilder`                   | 6.0.0          |
| `peregrine`                     | 11.0.0         |
| `pwa-buildpack`                 | 10.0.0         |
| `upward-js`                     | 5.1.0          |
| `upward-spec`                   | 5.0.0          |
| `venia-concept`                 | 11.0.0         |
| `venia-ui`                      | 8.0.0          |
| `magento2-upward-connector`     | 1.2.0          |
| `upward-php`                    | 1.1.5          |

## Known issues

- If you are using Multi-Source Inventory(MSI), a GraphQL issue prevents users from adding a configurable product to the shopping cart on non-default store views.
  This issue is fixed in Magento's `2.4-develop` branch, and should be available in the next Magento release.
- Prerender feature is unable to cache HTML on Fastly enabled environments.
- The `yarn watch` process may run out of memory if left running for an extended amount of time.
  If an error occurs because of this, restart the watcher.
- Navigating to the Venia storefront produces `TypeError: Failed to fetch` in the console.
  This is a [Workbox issue][] caused by the service worker when it requests the `index.html` route.
  This has no impact on Venia functionality but will be fixed in the next release when the Workbox dependency is updated.

  [workbox issue]: https://github.com/GoogleChrome/workbox/pull/2777

## Upgrading from a previous version

The method for updating to 11.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
The following are common use cases we have identified and how to update the project code.

### Scaffolded project

Using the [scaffolding tool][] is the recommended method for starting a new storefront project.
This tool generates a copy of the storefront project defined in the [Venia concept][] package.

#### Upgrade method: Update dependencies and manual merge

Since scaffolded projects consume PWA Studio libraries as dependencies, you just need to update your PWA Studio dependencies in your `package.json` file to use the released version.

After that, install the new dependencies using the install command:

```sh
yarn install
```

or

```sh
npm install
```

If you need to update other project files, such as configuration and build scripts,
you need to use a diff tool to compare your projects files with those of [Venia concept][].
This will help determine what changes you need to manually copy into your project files.

[scaffolding tool]: http://pwastudio.io/pwa-buildpack/scaffolding/
[venia concept]: https://github.com/magento/pwa-studio/tree/master/packages/venia-concept

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

This method can be a chore, and we hope that some of the features in 5.0.0+ will help these users migrate to a package management approach.

### NPM packages

Some users have imported the PWA Studio libraries using NPM.
This is the easiest way to work with the released versions of PWA Studio.

#### Upgrade method: Update `package.json`

To upgrade to the latest version (currently 11.0.0), simply call `yarn add` on each of the `@magento` packages. This will both update `package.json` in your project, as well as install the latest versions.

Sample command:

```
yarn add @magento/eslint-config @magento/pagebuilder @magento/peregrine @magento/pwa-buildpack @magento/upward-js @magento/venia-ui
```

[pwa studio releases]: https://github.com/magento/pwa-studio/releases
