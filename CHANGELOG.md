# Release 8.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 8.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 8.0.0](#whats-new-in-800)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Known issues](#known-issues)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 8.0.0

PWA Studio 8.0.0 contains new features, refactors, and various improvements.

### Improved performance

A lot of work has been done in this release to improve storefront performance.
This means that any project using the latest PWA Studio components will benefit from these updates.

One of the bigger changes is the migration to [Apollo Client 3.0][].
This version of the Apollo Client provides better cache controls and better network fetching performance in general.

This release also includes various refactors and improvements on the GraphQL queries themselves to reduce the API request times from Magento.

[apollo client 3.0]: https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/

### Complete cart and checkout experience

This release finishes the full page cart and checkout features introduced in previous releases.
The complete cart and checkout workflow is based on research made by members of the UX team.

Storefront developers can use this streamlined process as implemented or they can use the different components to customize their own cart and checkout workflow.

#### Shopping Bag feature

In addition to the complete full page cart and checkout experience, this release introduces a new Mini-Cart/Shopping Bag feature.

This feature is a floating modal that appears when you click on the shopping bag icon.
It replaces the old `MiniCart` component, which previously appeared as a drawer from the right side of the app.

Instead of competing with the full page cart feature, it only contains a subset of actions, such as removing an item and checking out.
For additional modifications to cart products, it links to the cart page.

Developers can still use the old `MiniCart` component in their projects, but it has been renamed to `LegacyMiniCart`.

### Branding updates

The UX team continues in their research to improve the look and feel of the Venia brand.
This release includes many style updates to give the Venia storefront a more modern and accessible experience.

Developers get all these improvements right away when they start their projects using this version of Venia as the base storefront or by upgrading their dependencies.

### My Account code preview

This releases includes a sneak peak at features associated with My Account, such as Wishlist, Order History, and Address Book.
Even though the Communications Page is the only navigable page, curious developers can peek at the 8.0.0 release codebase to see the initial code for these features.

### Targets reference documentation

During 8.0.0 development, the PWA Studio doc site has published reference documentation for extensibility targets in the different packages.
This documentation contains API descriptions and sample code to help developers discover the different PWA Studio extension points.

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                          | Change type  | PR        |
| ------------------------------------------------------------------------------------ | ------------ | --------- |
| Implemented initial code for the new MiniCart component                              | **Feature**  | [#2494][] |
| Created new components for an account menu                                           | **Feature**  | [#2550][] |
| Created components for a Newsletter Subscription page                                | **Feature**  | [#2571][] |
| Implemented initial code for an Order History page                                   | **Feature**  | [#2611][] |
| Implemented a way to access top/intermediate level categories through the left nav   | **Feature**  | [#2616][] |
| Implemented initial UX and workflow for a Forgot Password feature for My Account     | **Feature**  | [#2619][] |
| Implemented initial code for Wishlist                                                | **Feature**  | [#2620][] |
| Implemented the ability to translate Venia's header / footer                         | **Feature**  | [#2643][] |
| Added ability to allow PWA Studio to use a different store to localize CMS Pages     | **Feature**  | [#2649][] |
| Implemented initial code for Address Book                                            | **Feature**  | [#2653][] |
| Implemented initial code for an Order History table                                  | **Feature**  | [#2660][] |
| Updated Venia's button style to match new design                                     | **Update**   | [#2496][] |
| Added product listing to the MiniCart                                                | **Update**   | [#2506][] |
| Added a header section to the MiniCart                                               | **Update**   | [#2509][] |
| Added a footer section to the MiniCart                                               | **Update**   | [#2511][] |
| Adjusted styles for the header, main page, and footer components                     | **Update**   | [#2513][] |
| Update Gallery component to use `item.id` for key prop on GalleryItem                | **Update**   | [#2520][] |
| Added product link for each product in the MiniCart                                  | **Update**   | [#2549][] |
| Disabled the visibility of the MiniCart on the checkout page                         | **Update**   | [#2554][] |
| Added product links to the product listings on the cart page                         | **Update**   | [#2557][] |
| Updated Venia's filter modal styles to match the new design                          | **Update**   | [#2559][] |
| Added CSS to handle multiple configurable options                                    | **Update**   | [#2577][] |
| Implemented consistent error state handling                                          | **Update**   | [#2588][] |
| Added a sign-in section to the new My Account trigger in the header                  | **Update**   | [#2590][] |
| Enabled GET for GraphQL queries (but not mutations)                                  | **Update**   | [#2602][] |
| Added React Refresh to improve development server performance                        | **Update**   | [#2609][] |
| Improved error handling when using the Sign-in dropdown                              | **Update**   | [#2664][] |
| Updated static images to reflect new logo                                            | **Update**   | [#2693][] |
| Disabled account page routes for v8.0.0                                              | **Update**   | [#2709][] |
| Removed email from the reset password link                                           | **Update**   | [#2726][] |
| Refactored code to use tokens for color and weight                                   | **Refactor** | [#2500][] |
| Refactored Venia's inputs to match new design                                        | **Refactor** | [#2510][] |
| Refactored Venia's accordions to match the style guidelines                          | **Refactor** | [#2527][] |
| Refactored Venia's cards to match the style guidelines                               | **Refactor** | [#2545][] |
| Fixed a "Data Fetch Error" on the product page during offline mode                   | **Bugfix**   | [#2490][] |
| Fixed a bug that made the product and category sorting component unavailable         | **Bugfix**   | [#2493][] |
| Resolved remaining issues with Buttons component implementation                      | **Bugfix**   | [#2523][] |
| Fixed scroll lock page shifting                                                      | **Bugfix**   | [#2543][] |
| Fixed MiniCart blocking page interactions                                            | **Bugfix**   | [#2547][] |
| Fixed a sticky sidebar on the checkout page overlapping the footer                   | **Bugfix**   | [#2582][] |
| Fixed a bug that kept rendering the loading spinner on the page                      | **Bugfix**   | [#2583][] |
| Fixed MiniCart bug that prevent guest users from adding a product to an expired cart | **Bugfix**   | [#2612][] |
| Fixed button CSS to handle mobile view                                               | **Bugfix**   | [#2655][] |
| Fixed improper use of `formatMessage()`                                              | **Bugfix**   | [#2698][] |
| Fixed Storybook bug caused by i18n work                                              | **Bugfix**   | [#2705][] |
| Fixed Payment Information button to disable it while the Payment section loads       | **Bugfix**   | [#2723][] |
| Fixed an offline homepage error                                                      | **Bugfix**   | [#2727][] |

### Peregrine library

| Description                                                                                               | Change type  | PR        |
| --------------------------------------------------------------------------------------------------------- | ------------ | --------- |
| Added access to the root component type for child components                                              | **Feature**  | [#2443][] |
| Enable URL redirects when set in the Magento backend                                                      | **Feature**  | [#2504][] |
| Added Create Account functionality to the Sign-in trigger in the navigation menu                          | **Feature**  | [#2657][] |
| Added support for an app-wide configurable URL suffix                                                     | **Feature**  | [#2665][] |
| Added support for localized Catalog Products for different stores                                         | **Feature**  | [#2667][] |
| Implemented scroll top when payment information processing completes                                      | **Update**   | [#2498][] |
| Implemented logic for adding products to the MiniCart                                                     | **Update**   | [#2505][] |
| Updated fetching logic to use cache-and-network for the Cart/Checkout processes                           | **Update**   | [#2634][] |
| Moved cart creation logic out of cart trigger and into the cart context provider                          | **Refactor** | [#2572][] |
| Fixed an infinite error loop when cart creation fails                                                     | **Bugfix**   | [#2574][] |
| Fixed a bug that prevented adding to cart when another product in the cart is out of stock                | **Bugfix**   | [#2576][] |
| Fixed a bug on the Category page where it did not refresh data when clicking back, previous, or next page | **Bugfix**   | [#2641][] |
| Fixed a customer address bug related to addresses for countries without regions or states                 | **Bugfix**   | [#2659][] |
| Fixed bug caused by Apollo when upgrading from a previous release                                         | **Bugfix**   | [#2673][] |
| Fixed bug that showed product types that are not supported yet                                            | **Bugfix**   | [#2697][] |
| Fixed a data sort error                                                                                   | **Bugfix**   | [#2736][] |
| Fixed an error in the filters list associated with multiple filters having the same label                 | **Bugfix**   | [#2739][] |
| Fixed an address merging error during sign in                                                             | **Bugfix**   | [#2744][] |

### Build tools

| Description                                                                                  | Change type | PR        |
| -------------------------------------------------------------------------------------------- | ----------- | --------- |
| Created a staging server utility instead of a script                                         | **Feature** | [#2618][] |
| Deprecated `getUnionAndInterfaceTypes()` function                                            | **Update**  | [#2663][] |
| Fixed scaffolding bug that did not include a `pwa-studio` section in the `package.json` file | **Bugfix**  | [#2514][] |
| Fixed Storybook files for scaffolded projects                                                | **Bugfix**  | [#2708][] |

### UPWARD

| Description                                                                      | Change type | PR        |
| -------------------------------------------------------------------------------- | ----------- | --------- |
| Implemented feature that allows HTTP for the Magento backend URL                 | **Feature** | [#2423][] |
| Updated implementation code to improve WebPageTest score                         | **Update**  | [#2548][] |
| Added support for additional image types                                         | **Update**  | [#2562][] |
| Updated upward-security-headers peer dependencies                                | **Update**  | [#2605][] |
| Fixed UPWARD bug that prevented the use of an allowable header character         | **Bugfix**  | [#2484][] |
| Fixed image optimized middleware                                                 | **Bugfix**  | [#2535][] |
| Removed `rimraf` as a peer dependency in the `upward-security-headers` extension | **Bugfix**  | [#2594][] |
| Fixed YouTube and Vimeo urls being blocked                                       | **Bugfix**  | [#2656][] |

### Documentation

| Description                                                                   | Change type       | PR        |
| ----------------------------------------------------------------------------- | ----------------- | --------- |
| Created Venia Targets reference documentation                                 | **Documentation** | [#2472][] |
| Created Peregrine Targets reference documentation                             | **Documentation** | [#2492][] |
| Created Buildpack Targets reference documentation                             | **Documentation** | [#2508][] |
| Created reference docs for the UI components and talons used in the cart page | **Documentation** | [#2637][] |
| Added a note about Node 12 deprecation warnings                               | **Update**        | [#2566][] |
| Added upgrade steps in the changelog for scaffolded projects                  | **Update**        | [#2587][] |
| Updated `magento-research` references to `magento`                            | **Update**        | [#2599][] |
| Removed GraphQL limitation entry in the Page Builder docs                     | **Update**        | [#2630][] |
| Added Page Builder integration videos                                         | **Update**        | [#2632][] |
| Updated out of date content in the custom footer tutorial                     | **Update**        | [#2652][] |
| Added more verbose upgrade installation instructions in the README            | **Update**        | [#2662][] |
| Updated routing tutorial to use the extensibility framework                   | **Update**        | [#2670][] |
| Updated README                                                                | **Update**        | [#2676][] |
| Removed deprecated topics and files in the docs project                       | **Update**        | [#2684][] |
| Fixed a typo in the Add a static route docs                                   | **Bugfix**        | [#2553][] |
| Fixed a broken link                                                           | **Bugfix**        | [#2642][] |

### Misc

| Description                                                              | Change type | PR                  |
| ------------------------------------------------------------------------ | ----------- | ------------------- |
| Created simple README content for the create-pwa package                 | **Update**  | [#2415][]           |
| Updated contributors list                                                | **Update**  | [#2518][]           |
| Upgraded to @apollo/client@3                                             | **Update**  | [#2560][]           |
| Configure dependabot to only open 5 pull requests and restrict to semver | **Update**  | [#2526][] [#2528][] |
| Bumped http-proxy-middleware from 0.19.1 to 0.19.2                       | **Update**  | [#2532][]           |
| Bumped apollo-link-retry from 2.2.15 to 2.2.16                           | **Update**  | [#2530][]           |
| Bumped @apollo/react-hooks from 3.1.3 to 3.1.5                           | **Update**  | [#2529][]           |
| Bumped lodash from 4.17.14 to 4.17.19 in /docker                         | **Update**  | [#2556][]           |
| Bumped lodash from 4.17.15 to 4.17.19 in /pwa-devdocs                    | **Update**  | [#2555][]           |
| Bumped elliptic from 6.5.2 to 6.5.3                                      | **Update**  | [#2593][]           |
| Bumped elliptic from 6.5.2 to 6.5.3 in /pwa-devdocs                      | **Update**  | [#2596][]           |
| Bumbed dot-prop to version 5.1.1 or later                                | **Update**  | [#2601][]           |
| Bumped kramdown from 2.2.1 to 2.3.0 in /pwa-devdocs                      | **Update**  | [#2614][]           |
| Removed dependabot version bump settings                                 | **Update**  | [#2646][]           |
| Bumped bl from 3.0.0 to 3.0.1                                            | **Update**  | [#2675][]           |
| Fixed a PageBuilder visibility bug affecting slider buttons and links    | **Bugfix**  | [#2722][]           |

## Known issues

- PWA Studio 8.0.0 is not fully compatible with Magento 2.3.6, which can prevent Users from using the Reset Password feature.
- When switching stores as a logged in customer, the shopping cart is not reassigned to the new store.

## Upgrading from a previous version

The method for updating to 8.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
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

To upgrade to the latest version (currently 8.0.0), simply call `yarn add` on each of the `@magento` packages. This will both update `package.json` in your project, as well as install the latest versions.

Sample command:

```
yarn add @magento/eslint-config @magento/pagebuilder @magento/peregrine @magento/pwa-buildpack @magento/upward-js @magento/venia-ui
```

[pwa studio releases]: https://github.com/magento/pwa-studio/releases

[`venia-ui-declare.js`]: https://github.com/magento/pwa-studio/blob/release/8.0/packages/venia-ui/lib/targets/venia-ui-declare.js
[`peregrine-declare.js`]: https://github.com/magento/pwa-studio/blob/release/8.0/packages/peregrine/lib/targets/peregrine-declare.js
[`declare-base.js`]: https://github.com/magento/pwa-studio/blob/release/8.0/packages/pwa-buildpack/lib/BuildBus/declare-base.js
[dialog component]: https://github.com/magento/pwa-studio/tree/release/8.0/packages/venia-ui/lib/components/Dialog
[pwa studio fundamentals]: http://pwastudio.io/tutorials/pwa-studio-fundamentals/
[page builder]: https://magento.com/products/magento-commerce/page-builder

[#2708]: https://github.com/magento/pwa-studio/pull/2708
[#2705]: https://github.com/magento/pwa-studio/pull/2705
[#2698]: https://github.com/magento/pwa-studio/pull/2698
[#2697]: https://github.com/magento/pwa-studio/pull/2697
[#2693]: https://github.com/magento/pwa-studio/pull/2693
[#2684]: https://github.com/magento/pwa-studio/pull/2684
[#2676]: https://github.com/magento/pwa-studio/pull/2676
[#2675]: https://github.com/magento/pwa-studio/pull/2675
[#2673]: https://github.com/magento/pwa-studio/pull/2673
[#2670]: https://github.com/magento/pwa-studio/pull/2670
[#2667]: https://github.com/magento/pwa-studio/pull/2667
[#2665]: https://github.com/magento/pwa-studio/pull/2665
[#2664]: https://github.com/magento/pwa-studio/pull/2664
[#2663]: https://github.com/magento/pwa-studio/pull/2663
[#2662]: https://github.com/magento/pwa-studio/pull/2662
[#2660]: https://github.com/magento/pwa-studio/pull/2660
[#2659]: https://github.com/magento/pwa-studio/pull/2659
[#2657]: https://github.com/magento/pwa-studio/pull/2657
[#2656]: https://github.com/magento/pwa-studio/pull/2656
[#2655]: https://github.com/magento/pwa-studio/pull/2655
[#2653]: https://github.com/magento/pwa-studio/pull/2653
[#2652]: https://github.com/magento/pwa-studio/pull/2652
[#2649]: https://github.com/magento/pwa-studio/pull/2649
[#2646]: https://github.com/magento/pwa-studio/pull/2646
[#2643]: https://github.com/magento/pwa-studio/pull/2643
[#2642]: https://github.com/magento/pwa-studio/pull/2642
[#2641]: https://github.com/magento/pwa-studio/pull/2641
[#2637]: https://github.com/magento/pwa-studio/pull/2637
[#2634]: https://github.com/magento/pwa-studio/pull/2634
[#2632]: https://github.com/magento/pwa-studio/pull/2632
[#2630]: https://github.com/magento/pwa-studio/pull/2630
[#2620]: https://github.com/magento/pwa-studio/pull/2620
[#2619]: https://github.com/magento/pwa-studio/pull/2619
[#2618]: https://github.com/magento/pwa-studio/pull/2618
[#2616]: https://github.com/magento/pwa-studio/pull/2616
[#2614]: https://github.com/magento/pwa-studio/pull/2614
[#2612]: https://github.com/magento/pwa-studio/pull/2612
[#2611]: https://github.com/magento/pwa-studio/pull/2611
[#2609]: https://github.com/magento/pwa-studio/pull/2609
[#2605]: https://github.com/magento/pwa-studio/pull/2605
[#2602]: https://github.com/magento/pwa-studio/pull/2602
[#2601]: https://github.com/magento/pwa-studio/pull/2601
[#2599]: https://github.com/magento/pwa-studio/pull/2599
[#2596]: https://github.com/magento/pwa-studio/pull/2596
[#2594]: https://github.com/magento/pwa-studio/pull/2594
[#2593]: https://github.com/magento/pwa-studio/pull/2593
[#2590]: https://github.com/magento/pwa-studio/pull/2590
[#2588]: https://github.com/magento/pwa-studio/pull/2588
[#2587]: https://github.com/magento/pwa-studio/pull/2587
[#2584]: https://github.com/magento/pwa-studio/pull/2584
[#2583]: https://github.com/magento/pwa-studio/pull/2583
[#2582]: https://github.com/magento/pwa-studio/pull/2582
[#2577]: https://github.com/magento/pwa-studio/pull/2577
[#2576]: https://github.com/magento/pwa-studio/pull/2576
[#2574]: https://github.com/magento/pwa-studio/pull/2574
[#2572]: https://github.com/magento/pwa-studio/pull/2572
[#2571]: https://github.com/magento/pwa-studio/pull/2571
[#2569]: https://github.com/magento/pwa-studio/pull/2569
[#2566]: https://github.com/magento/pwa-studio/pull/2566
[#2562]: https://github.com/magento/pwa-studio/pull/2562
[#2560]: https://github.com/magento/pwa-studio/pull/2560
[#2559]: https://github.com/magento/pwa-studio/pull/2559
[#2557]: https://github.com/magento/pwa-studio/pull/2557
[#2556]: https://github.com/magento/pwa-studio/pull/2556
[#2555]: https://github.com/magento/pwa-studio/pull/2555
[#2554]: https://github.com/magento/pwa-studio/pull/2554
[#2553]: https://github.com/magento/pwa-studio/pull/2553
[#2550]: https://github.com/magento/pwa-studio/pull/2550
[#2549]: https://github.com/magento/pwa-studio/pull/2549
[#2548]: https://github.com/magento/pwa-studio/pull/2548
[#2547]: https://github.com/magento/pwa-studio/pull/2547
[#2545]: https://github.com/magento/pwa-studio/pull/2545
[#2543]: https://github.com/magento/pwa-studio/pull/2543
[#2538]: https://github.com/magento/pwa-studio/pull/2538
[#2535]: https://github.com/magento/pwa-studio/pull/2535
[#2532]: https://github.com/magento/pwa-studio/pull/2532
[#2530]: https://github.com/magento/pwa-studio/pull/2530
[#2529]: https://github.com/magento/pwa-studio/pull/2529
[#2528]: https://github.com/magento/pwa-studio/pull/2528
[#2527]: https://github.com/magento/pwa-studio/pull/2527
[#2526]: https://github.com/magento/pwa-studio/pull/2526
[#2523]: https://github.com/magento/pwa-studio/pull/2523
[#2520]: https://github.com/magento/pwa-studio/pull/2520
[#2518]: https://github.com/magento/pwa-studio/pull/2518
[#2516]: https://github.com/magento/pwa-studio/pull/2516
[#2514]: https://github.com/magento/pwa-studio/pull/2514
[#2513]: https://github.com/magento/pwa-studio/pull/2513
[#2511]: https://github.com/magento/pwa-studio/pull/2511
[#2510]: https://github.com/magento/pwa-studio/pull/2510
[#2509]: https://github.com/magento/pwa-studio/pull/2509
[#2508]: https://github.com/magento/pwa-studio/pull/2508
[#2506]: https://github.com/magento/pwa-studio/pull/2506
[#2505]: https://github.com/magento/pwa-studio/pull/2505
[#2504]: https://github.com/magento/pwa-studio/pull/2504
[#2500]: https://github.com/magento/pwa-studio/pull/2500
[#2498]: https://github.com/magento/pwa-studio/pull/2498
[#2496]: https://github.com/magento/pwa-studio/pull/2496
[#2494]: https://github.com/magento/pwa-studio/pull/2494
[#2493]: https://github.com/magento/pwa-studio/pull/2493
[#2492]: https://github.com/magento/pwa-studio/pull/2492
[#2490]: https://github.com/magento/pwa-studio/pull/2490
[#2484]: https://github.com/magento/pwa-studio/pull/2484
[#2472]: https://github.com/magento/pwa-studio/pull/2472
[#2443]: https://github.com/magento/pwa-studio/pull/2443
[#2423]: https://github.com/magento/pwa-studio/pull/2423
[#2415]: https://github.com/magento/pwa-studio/pull/2415
[#2709]: https://github.com/magento/pwa-studio/pull/2709
[#2722]: https://github.com/magento/pwa-studio/pull/2722
[#2723]: https://github.com/magento/pwa-studio/pull/2723
[#2726]: https://github.com/magento/pwa-studio/pull/2726
[#2736]: https://github.com/magento/pwa-studio/pull/2736
[#2727]: https://github.com/magento/pwa-studio/pull/2727
[#2739]: https://github.com/magento/pwa-studio/pull/2739
[#2744]: https://github.com/magento/pwa-studio/pull/2744