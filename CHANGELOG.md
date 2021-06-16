<!-- 

TODO: Include the following items in future release notes to help with version upgrades

  * A table of the new versions published for individual packages
  * List of updated template files
  * Any updates to environmental variables

-->
# Release 10.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 10.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 10.0.0](#whats-new-in-1000)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Known issues](#known-issues)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 10.0.0

PWA Studio 10.0.0 contains new features, refactors, bug fixes, and various improvements.
This version is compatible with **Magento 2.4.2**.

### Build report tool

The build report tool is a Buildpack CLI command that returns information about a storefront setup and development environment.
This feature makes it easier to provide information when reporting issues or for general debugging purposes.

The following command is now available for newly scaffolded projects:

```sh
yarn build:report
```

[![Image from Gyazo](https://i.gyazo.com/960b390007953778d67d298bd27b4886.png)](https://gyazo.com/960b390007953778d67d298bd27b4886)

### Check or Money Order payments

A PWA Studio extension that allows check or money order payments is now available thanks to the contribution of community member [Lars Roettig][].
If the Magento backend has the **Check or Money Order** option enabled, this extension lets storefront customers use this payment option.

Storefront developers can install this extension to add the new payment feature instead of writing custom frontend code to support this feature.
Extension developers can view the extension's [source code][] to learn how to implement their own payment methods extension.

**NOTE:**
_Currently, the data for `Make Check Payable to` and `Send Check to` is static because data from the Admin is not available from the GraphQL endpoint in Magento 2.4.2._

![Check or Money Order payment](https://user-images.githubusercontent.com/40405790/110977749-22296200-8328-11eb-89e2-4a0116a55647.png)

[Lars Roettig]: https://github.com/larsroettig
[source code]: https://github.com/magento/pwa-studio/tree/develop/packages/extensions/venia-sample-payments-checkmo

### Custom scaffolding template

The Buildpack scaffolding tool for creating new projects now lets you specify a custom template and version.
This feature lets you create a storefront project based on a non-Venia template or use a pre-release version of the Venia template.

![Custom scaffolding template](https://user-images.githubusercontent.com/4692281/112341120-25f5a680-8c8f-11eb-9174-122dcc1eb5c4.png)

### MegaMenu component

A MegaMenu component is now available in the Venia UI library thanks to the contribution of community member [Marcin Kwiatkowski][].
This component displays product categories and subcategories defined in the Magento backend.

![MegaMenu component](https://user-images.githubusercontent.com/11998249/104089828-473f1d00-5272-11eb-900f-b7e11d9a532b.png)

[Marcin Kwiatkowski]: https://github.com/Frodigo

### Store switcher

The Venia UI library now provides components that support multiple store views.
These components let customers switch between the different store views defined in the Magento backend.

These components also support grouped store views if available from Magento.

![](https://i.gyazo.com/8ed1bfeb749823013695e4eb930d2e81.png)

### Improved performance

This release improves the performance of the Venia storefront and its underlying components.
These improvements include:

- Enabling text compression for the UPWARD-JS server
- Removing unused JavaScript in Venia
- Investigating and improving render blocking and response in Venia

### Increased test coverage

Our continued commitment to stability and quality has seen an increase in overall unit test code coverage.

Coverage as reported by [coveralls.io][]:

Current coverage (10.0.0): **85.685%**

Previous coverage (9.0.1): **84.19%**

[coveralls.io]: <https://coveralls.io/github/magento/pwa-studio>

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                                       | Change type | PR        |
| ------------------------------------------------------------------------------------------------- | ----------- | --------- |
| Added MegeMenu feature and components                                                             | **Feature** | [#2932][] |
| Added ability to lazy Load/trim unused bytes in main routes                                       | **Feature** | [#2988][] |
| Implemented Check or Money Order payment feature                                                  | **Feature** | [#2969][] |
| Added support for Configurable Product Image setting in the backend                               | **Feature** | [#2958][] |
| Created Store Switcher Groups components                                                          | **Feature** | [#2956][] |
| Added ability to remove saved payment methods                                                     | **Feature** | [#2943][] |
| Created ErrorView components                                                                      | **Feature** | [#2936][] |
| Created Debugging Reporter feature                                                                | **Feature** | [#2910][] |
| Added link click handler inside of GalleryItem                                                    | **Feature** | [#3053][] |
| Excluded `venia-ui/lib/components/Checkout` from Coverage Report                                  | **Update**  | [#3023][] |
| Increased test coverage for `venia-ui/lib/components/CreateAccountPage`                           | **Update**  | [#3021][] |
| Increased test coverage in `venia-ui/lib/components/CheckoutPage`                                 | **Update**  | [#3018][] |
| Created Venia UI App related tests                                                                | **Update**  | [#3015][] |
| Removed "Home Page" from Title                                                                    | **Update**  | [#3012][] |
| Increased test coverage in `venia-ui/lib/components/MagentoRoute`                                 | **Update**  | [#3006][] |
| Increased test coverage in `venia-ui/lib/components/Main`                                         | **Update**  | [#3004][] |
| Removed data from all persisted Apollo caches                                                     | **Update**  | [#2992][] |
| Investigated and improved render/blocking in Venia                                                | **Update**  | [#2952][] |
| Fixed mini cart not updating when logged in user has the same simple product already added        | **Bugfix**  | [#2996][] |
| Fixed CMS header line height                                                                      | **Bugfix**  | [#3032][] |
| Fixed bug where default Toasts do not fall back to using the DEFAULT_TIMEOUT                      | **Bugfix**  | [#2982][] |
| Fixed a bug where dialog component would not reset fields on close after submitting               | **Bugfix**  | [#2960][] |
| Set a fixed minimum height on the main page                                                       | **Bugfix**  | [#2942][] |
| Added a page level error and disabled checkout button when there are no available payment methods | **Bugfix**  | [#2873][] |

### Peregrine library

| Description                                                                               | Change type  | PR        |
| ----------------------------------------------------------------------------------------- | ------------ | --------- |
| Added middleware to schedule sign-out                                                     | **Feature**  | [#2904][] |
| Added support for Product URL and Category URL Settings                                   | **Feature**  | [#2895][] |
| Increased test coverage for `packages/peregrine/lib/talons/CheckoutPage`                  | **Update**   | [#3024][] |
| Increase test coverage in `peregrine/lib/talons/SignIn`                                   | **Update**   | [#2998][] |
| Updated Media Url generation logic to use store code header with a default fallback value | **Update**   | [#2941][] |
| Moved Price Summary GraphQL fragment into Peregrine                                       | **Refactor** | [#3007][] |
| Refactor comment on cmsPage talon to reflect why we compare against default string        | **Refactor** | [#3062][] |
| Cleaned up an invalid function reference in billing address                               | **Refactor** | [#3065][] |

### Build tools

| Description                                                            | Change type | PR        |
| ---------------------------------------------------------------------- | ----------- | --------- |
| Added ability to use custom template for scaffolding                   | **Feature** | [#3025][] |
| Added option to use custom https certificates with buildpack           | **Feature** | [#2946][] |
| Updated compile time logic to fetch store name from the GraphQL server | **Update**  | [#3019][] |
| Fixed command escaping in the `create-pwa` shell command               | **Bugfix**  | [#3022][] |

### UPWARD

| Description                                                     | Change type | PR        |
| --------------------------------------------------------------- | ----------- | --------- |
| Added support for express server compression middleware.        | **Feature** | [#2980][] |
| Added ability to allow `blob` types for UPWARD security headers | **Feature** | [#2985][] |
| Added the xfwd option to the proxyMiddleware                    | **Feature** | [#2986][] |

### Extensions

| Description                                           | Change type | PR        |
| ----------------------------------------------------- | ----------- | --------- |
| Added a null check for element styling in PageBuilder | **Update**  | [#3016][] |

### Documentation

| Description                                     | Change type       | PR        |
| ----------------------------------------------- | ----------------- | --------- |
| Published a new tag list extension tutorial     | **Documentation** | [#3044][] |
| Published new topic about extension development | **Documentation** | [#2995][] |
| Published new topic about Targetables           | **Documentation** | [#2966][] |
| Updated code sample in documentation            | **Update**        | [#2938][] |
| Updated getting started section in docs         | **Update**        | [#2926][] |
| Updated "Modify talon results" tutorial         | **Bugfix**        | [#3039][] |
| Fixed broken link in doc topic                  | **Bugfix**        | [#3002][] |

### Misc

| Description                                  | Change type | PR        |
| -------------------------------------------- | ----------- | --------- |
| Removed auto-assign logic for new docs issue | **Update**  | [#3040][] |
| Upgraded workbox to v6                       | **Update**  | [#2983][] |
| Added coveralls badge back to the README     | **Update**  | [#2978][] |
| Upgraded React to v17                        | **Update**  | [#2962][] |
| Enabled singleton style tag                  | **Update**  | [#2906][] |
| Updated prettier config                      | **Update**  | [#2900][] |
| Removed cyclic dependencies                  | **Bugfix**  | [#2967][] |

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

The method for updating to 10.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
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

To upgrade to the latest version (currently 10.0.0), simply call `yarn add` on each of the `@magento` packages. This will both update `package.json` in your project, as well as install the latest versions.

Sample command:

```
yarn add @magento/eslint-config @magento/pagebuilder @magento/peregrine @magento/pwa-buildpack @magento/upward-js @magento/venia-ui
```

[pwa studio releases]: https://github.com/magento/pwa-studio/releases

[#3044]: https://github.com/magento/pwa-studio/pull/3044
[#3040]: https://github.com/magento/pwa-studio/pull/3040
[#3039]: https://github.com/magento/pwa-studio/pull/3039
[#3032]: https://github.com/magento/pwa-studio/pull/3032
[#3025]: https://github.com/magento/pwa-studio/pull/3025
[#3024]: https://github.com/magento/pwa-studio/pull/3024
[#3023]: https://github.com/magento/pwa-studio/pull/3023
[#3022]: https://github.com/magento/pwa-studio/pull/3022
[#3021]: https://github.com/magento/pwa-studio/pull/3021
[#3019]: https://github.com/magento/pwa-studio/pull/3019
[#3018]: https://github.com/magento/pwa-studio/pull/3018
[#3016]: https://github.com/magento/pwa-studio/pull/3016
[#3015]: https://github.com/magento/pwa-studio/pull/3015
[#3012]: https://github.com/magento/pwa-studio/pull/3012
[#3011]: https://github.com/magento/pwa-studio/pull/3011
[#3007]: https://github.com/magento/pwa-studio/pull/3007
[#3006]: https://github.com/magento/pwa-studio/pull/3006
[#3004]: https://github.com/magento/pwa-studio/pull/3004
[#3002]: https://github.com/magento/pwa-studio/pull/3002
[#2998]: https://github.com/magento/pwa-studio/pull/2998
[#2996]: https://github.com/magento/pwa-studio/pull/2996
[#2995]: https://github.com/magento/pwa-studio/pull/2995
[#2992]: https://github.com/magento/pwa-studio/pull/2992
[#2988]: https://github.com/magento/pwa-studio/pull/2988
[#2985]: https://github.com/magento/pwa-studio/pull/2985
[#2983]: https://github.com/magento/pwa-studio/pull/2983
[#2982]: https://github.com/magento/pwa-studio/pull/2982
[#2980]: https://github.com/magento/pwa-studio/pull/2980
[#2978]: https://github.com/magento/pwa-studio/pull/2978
[#2969]: https://github.com/magento/pwa-studio/pull/2969
[#2967]: https://github.com/magento/pwa-studio/pull/2967
[#2966]: https://github.com/magento/pwa-studio/pull/2966
[#2962]: https://github.com/magento/pwa-studio/pull/2962
[#2960]: https://github.com/magento/pwa-studio/pull/2960
[#2958]: https://github.com/magento/pwa-studio/pull/2958
[#2956]: https://github.com/magento/pwa-studio/pull/2956
[#2952]: https://github.com/magento/pwa-studio/pull/2952
[#2946]: https://github.com/magento/pwa-studio/pull/2946
[#2943]: https://github.com/magento/pwa-studio/pull/2943
[#2942]: https://github.com/magento/pwa-studio/pull/2942
[#2941]: https://github.com/magento/pwa-studio/pull/2941
[#2938]: https://github.com/magento/pwa-studio/pull/2938
[#2936]: https://github.com/magento/pwa-studio/pull/2936
[#2926]: https://github.com/magento/pwa-studio/pull/2926
[#2910]: https://github.com/magento/pwa-studio/pull/2910
[#2906]: https://github.com/magento/pwa-studio/pull/2906
[#2904]: https://github.com/magento/pwa-studio/pull/2904
[#2900]: https://github.com/magento/pwa-studio/pull/2900
[#2895]: https://github.com/magento/pwa-studio/pull/2895
[#2873]: https://github.com/magento/pwa-studio/pull/2873
[#2986]: https://github.com/magento/pwa-studio/pull/2986
[#3062]: https://github.com/magento/pwa-studio/pull/3062
[#2932]: https://github.com/magento/pwa-studio/pull/2932
[#3053]: https://github.com/magento/pwa-studio/pull/3053
[#3065]: https://github.com/magento/pwa-studio/pull/3065
