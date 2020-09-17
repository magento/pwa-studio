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

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                             | Change type | PR        |
| --------------------------------------------------------------------------------------- | ----------- | --------- |

### Peregrine library

| Description                                                                                    | Change type | PR        |
| ---------------------------------------------------------------------------------------------- | ----------- | --------- |

### Build tools

| Description                                                                               | Change type | PR        |
| ----------------------------------------------------------------------------------------- | ----------- | --------- |

### Documentation

| Description                                                      | Change type       | PR        |
| ---------------------------------------------------------------- | ----------------- | --------- |

### Misc

| Description                                                               | Change type | PR                  |
| ------------------------------------------------------------------------- | ----------- | ------------------- |

## Known issues

- A new Mini Cart is in development which removes the checkout flow in favor of the standalone Checkout page.
  An issue exists in the checkout section of the old Mini Cart where the **Pay with Card** header does not appear on the Credit Card payment form.
  This issue is low priority since the old Mini Cart will be replaced with the new one in future releases.

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

| Description                                                                                 |    Change type    |     PR    |
| :------------------------------------------------------------------------------------------ | :---------------: | :-------: |
| fix: scaffold storybook                                                                     |     **Bugfix**    | [#2708][] |
| fix: storybook i18n                                                                         |     **Bugfix**    | [#2705][] |
| \[bugfix] Use formatMessage ids and default messages per api                                |     **Bugfix**    | [#2698][] |
| PDPs show intended Product only                                                             |       **-**       | [#2697][] |
| Update static images to reflect new logo                                                    |       **-**       | [#2693][] |
| Remove outdated things from docs                                                            |       **-**       | [#2684][] |
| \[Doc] Update README                                                                        |       **-**       | [#2676][] |
| Bump bl from 3.0.0 to 3.0.1                                                                 |       **-**       | [#2675][] |
| fix: apollo upgrade path                                                                    |     **Bugfix**    | [#2673][] |
| \[Docs] update routing tutorial                                                             | **Documentation** | [#2670][] |
| \[PWA-809] Allow PWA Studio to use a different store to localize Catalog Products           |       **-**       | [#2667][] |
| Support configured URL suffix across entire app                                             |     **Bugfix**    | [#2665][] |
| fix: Do not render the account menu elements when accountMenuIsOpen is false.               |     **Bugfix**    | [#2664][] |
| Deprecate getUnionAndInterfaceTypes function                                                |       **-**       | [#2663][] |
| Add some slightly more verbose upgrade installation instructions                            |       **-**       | [#2662][] |
| \[PWA-626] My Account: Order History: Table View (Collapsed)                                |       **-**       | [#2660][] |
| \[fix]: Allow for region field path customization depending on form mutation requirements   |     **Bugfix**    | [#2659][] |
| My Account - Create an Account component.                                                   |       **-**       | [#2657][] |
| fix: Add youtube and vimeo urls to CSP for PageBuilder                                      |     **Bugfix**    | [#2656][] |
| fix: center button on communications page on mobile                                         |     **Bugfix**    | [#2655][] |
| Address Book Skeleton                                                                       |       **-**       | [#2653][] |
| \[Doc] Update out of date content in the custom footer tutorial                             |       **-**       | [#2652][] |
| \[PWA-808] Allow PWA Studio to use a different store to localize CMS Pages                  |       **-**       | [#2649][] |
| Remove dependabot                                                                           |       **-**       | [#2646][] |
| \[PWA-811] Provide ability to translate Venia's header / footer                             |       **-**       | [#2643][] |
| \[Doc] fix broken link                                                                      |     **Bugfix**    | [#2642][] |
| \[Fix bug] Category didn't refresh data when click back previous or next page of…           |     **Bugfix**    | [#2641][] |
| \[Doc] cart page reference docs                                                             |       **-**       | [#2637][] |
| fix: Cart/Checkout summary uses cache-and-network to fetch latest                           |     **Bugfix**    | [#2634][] |
| PB-Videos: Added Page Builder integration videos                                            |       **-**       | [#2632][] |
| Remove GraphGL limitation entry                                                             |       **-**       | [#2630][] |
| \[PWA-281] My Account: Wishlist (Skeleton)                                                  |       **-**       | [#2620][] |
| My Account - Forgot Password                                                                |       **-**       | [#2619][] |
| #2407 Add yarn serve                                                                        |       **-**       | [#2618][] |
| \[feature]: Provide a way to access top/intermediate level categories through left nav      |    **Feature**    | [#2616][] |
| Bump kramdown from 2.2.1 to 2.3.0 in /pwa-devdocs                                           |       **-**       | [#2614][] |
| \[PWA-767] \[Mini-cart] Guest user can't add product to cart if cart is expired.            |       **-**       | [#2612][] |
| Order History Page Skeleton                                                                 |       **-**       | [#2611][] |
| \[PWA-653] React Refresh                                                                    |       **-**       | [#2609][] |
| Updates upward-security-headers peer dependencies                                           |       **-**       | [#2605][] |
| PWA-644: Use GET for GraphQL queries (but not mutations)                                    |       **-**       | [#2602][] |
| Fix security alert "Upgrade dot-prop to version 5.1.1 or later"                             |     **Bugfix**    | [#2601][] |
| Update \`magento-research\` references to \`magento\` org                                   |       **-**       | [#2599][] |
| Bump elliptic from 6.5.2 to 6.5.3 in /pwa-devdocs                                           |       **-**       | [#2596][] |
| fix: remove rimraf from security package                                                    |     **Bugfix**    | [#2594][] |
| Bump elliptic from 6.5.2 to 6.5.3                                                           |       **-**       | [#2593][] |
| My Account Sign In.                                                                         |       **-**       | [#2590][] |
| PWA-718: FormError                                                                          |       **-**       | [#2588][] |
| \[Doc] Add upgrade steps for scaffolded project                                             |       **-**       | [#2587][] |
| \[Release] Back merge release/7.0 into develop                                              |       **-**       | [#2584][] |
| fix: unset page loading on cms unmount                                                      |     **Bugfix**    | [#2583][] |
| fix: sticky sidebar on checkout page no longer overlaps footer                              |     **Bugfix**    | [#2582][] |
| Added CSS to handle multiple configurable options.                                          |       **-**       | [#2577][] |
| \[PWA-746] \[bug]: Can't add product to cart if another out of stock product is in the cart |     **Bugfix**    | [#2576][] |
| fix: no more infinite error loop if cart creation fails                                     |     **Bugfix**    | [#2574][] |
| fix: move cart creation out of trigger                                                      |     **Bugfix**    | [#2572][] |
| Customer Account - Newsletter Subscription                                                  |       **-**       | [#2571][] |
| DON'T MERGE - Test Release Branch Deploy                                                    |       **-**       | [#2569][] |
| \[Doc] Add note about Node 12 deprecation warnings                                          |       **-**       | [#2566][] |
| There are other image types                                                                 |       **-**       | [#2562][] |
| Upgrade to @apollo/client@3                                                                 |       **-**       | [#2560][] |
| \[PWA-713] Update Venia's filters                                                           |       **-**       | [#2559][] |
| Cart page product links.                                                                    |       **-**       | [#2557][] |
| Bump lodash from 4.17.14 to 4.17.19 in /docker                                              |       **-**       | [#2556][] |
| Bump lodash from 4.17.15 to 4.17.19 in /pwa-devdocs                                         |       **-**       | [#2555][] |
| Hide mini cart on the checkout page.                                                        |       **-**       | [#2554][] |
| \[Docs] Add a static route docs - Snippet correction                                        | **Documentation** | [#2553][] |
| Account Menu                                                                                |       **-**       | [#2550][] |
| Mini Cart V2 - Product link for each product in the mini cart.                              |       **-**       | [#2549][] |
| \[PWA-680] Webpagetest security score is too low                                            |       **-**       | [#2548][] |
| Fix MiniCart Interaction Blocking                                                           |     **Bugfix**    | [#2547][] |
| PWA-706: Update Venia's cards to match the style guides cards                               |       **-**       | [#2545][] |
| Scroll lock effect avoid body shift when activated                                          |       **-**       | [#2543][] |
| \[PWA-733] Backmerge release/7.0 into develop                                               |       **-**       | [#2538][] |
| \[PWA-666]: Update Hastily image optimizer                                                  |       **-**       | [#2535][] |
| Bump http-proxy-middleware from 0.19.1 to 0.19.2                                            |       **-**       | [#2532][] |
| Bump apollo-link-retry from 2.2.15 to 2.2.16                                                |       **-**       | [#2530][] |
| Bump @apollo/react-hooks from 3.1.3 to 3.1.5                                                |       **-**       | [#2529][] |
| forgot an s                                                                                 |       **-**       | [#2528][] |
| PWA-707: Update Venia's accordions to match the style guides accordions                     |       **-**       | [#2527][] |
| Restrict open pulls to 5 and restrict to semver                                             |       **-**       | [#2526][] |
| PWA-722: Venia button follow up changes                                                     |       **-**       | [#2523][] |
| Update Gallery component to use item.id for key prop on GalleryItem                         |       **-**       | [#2520][] |
| Add Shikha Mishra to contributers list                                                      |       **-**       | [#2518][] |
| DONT MERGE - Release test PR                                                                |       **-**       | [#2516][] |
| pwa-studio section is missing from final package                                            |       **-**       | [#2514][] |
| Adjust page-level max-width                                                                 |       **-**       | [#2513][] |
| Mini Cart V2 / Shopping Bag Footer section.                                                 |       **-**       | [#2511][] |
| \[PWA-623]: Update Venia's inputs                                                           |       **-**       | [#2510][] |
| Mini Cart V2 / Shopping Bag header component.                                               |       **-**       | [#2509][] |
| \[Doc] buildpack ref docs                                                                   |       **-**       | [#2508][] |
| Mini Cart V2 / Shopping bag product listing                                                 |       **-**       | [#2506][] |
| PWA-602: Add to Shopping Bag from PDP                                                       |       **-**       | [#2505][] |
| Respect URL Redirects                                                                       |       **-**       | [#2504][] |
| Use tokens for color and weight                                                             |       **-**       | [#2500][] |
| Scroll top when payment information is done                                                 |       **-**       | [#2498][] |
| PWA-622: Update Venia's button                                                              |       **-**       | [#2496][] |
| New MiniCart                                                                                |       **-**       | [#2494][] |
| #2441: Fix for Category Sort                                                                |     **Bugfix**    | [#2493][] |
| \[Doc] peregrine targets ref docs                                                           |       **-**       | [#2492][] |
| Fix "Data Fetch Error" on product page in offline mode (#2489)                              |     **Bugfix**    | [#2490][] |
| Add legal header character                                                                  |       **-**       | [#2484][] |
| \[Docs] Venia Targets reference doc                                                         | **Documentation** | [#2472][] |
| root component type need to know in some cases by component                                 |       **-**       | [#2443][] |
| Allow Magento HTTP Backend when configured                                                  |       **-**       | [#2423][] |
| Unable to find a readme for @magento/create-pwa@1.1.1 in npmjs.com                          |       **-**       | [#2415][] |

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
