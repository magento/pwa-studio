# Release 7.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 7.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 7.0.0](#whats-new-in-700)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Known issues](#known-issues)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 7.0.0

PWA Studio 7.0.0 contains new features, refactors, and various improvements.

### Extensibility framework

This release improves on the extensibility framework introduced in version 6.0.0.
It introduces new extension points for the Buildpack, Peregrine, and Venia UI library components.

Developers can use these extension points to extend their storefront project without duplicating and maintaining PWA-Studio code.

As of 7.0.0, PWA-Studio contains the following extension points:

#### Venia UI extension points

Venia UI extension points are declared in [`venia-ui-declare.js`][].

| Target name            | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `richContentRenderers` | Add custom rich content renderers to your storefront |
| `routes`               | Add or modify storefront-specific routes             |

#### Peregrine extension points

Peregrine extensions points are declared in [`peregrine-declare.js`][].

| Target name | Description                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| `talons`    | Intercept specific Peregrine talons and wrap them with your custom components |

Wrappable talons:

- `useProductFullDetail()`
- `useApp()`

#### Buildpack extension points

Buildpack extension points are declared in [`declare-base.js`][].

| Target name        | Description                                                                   |
| ------------------ | ----------------------------------------------------------------------------- |
| `enVarDefinition`  | Add custom environment variables to PWA-Studio's environment variables system |
| `transformModules` | Apply custom file transformers through webpack                                |
| `webpackCompiler`  | Access the webpack compiler object                                            |
| `specialFeatures`  | Specify special features to the webpack compiler for components               |

### New Venia look

Release 7.0.0 introduces numerous improvements to the shopper experience with various stylistic changes to the Venia example storefront.
These storefront changes are the result of extensive research by the UX team to provide an optimal shopping experience.

These improvements are available to developers as individual library components or as a whole when they set up a new storefront project.

#### Page Builder home page

In addition to the style changes for Venia, release 7.0.0 also adds a new home page built using [Page Builder][].
The content of this CMS page is defined in the Magento Admin using the Page Builder extension.
It showcases Page Builder content types such as Sliders, Banners, and Gallery Items.

This new page replaces the old home page content in Venia.

[Check out the new Venia homepage](https://venia.magento.com/)

### Standalone Cart and Checkout pages

This release builds on the standalone Shopping Cart page introduced in 6.0.0 and connects it to a new standalone Checkout page.
Developers can use these pages as starting points in their storefront projects or use the new components developed for those pages in their own solutions.

These pages are still under development as of this release, but you can view the current progress at:

https://develop.pwa-venia.com/cart

### Order Confirmation page

This release adds an Order Confirmation page at the end of the cart and checkout workflow.
It contains the billing and shipping information specified during checkout along with the items ordered.

This page works with guest and authenticated checkout.
For guest checkout, the shopper is given the option to create an account for the store.

### Standard Dialog component

This release introduces a standard modal window with the [Dialog component][].

Modals are child windows that render over the main application.
They are highly visual components that show important messages or prompts for user interactions.

The Dialog component introduced in this release provides a standard way of working with this modal windows.
This guarantees a unified look and feel for all your modal window use cases.

### PWA Studio Fundamentals tutorials

Over the course of 7.0.0 development, the PWA Studio doc site has published introductory tutorials for working with the PWA-Studio tools and libraries.

These tutorials provide steps for common tasks associated with storefront development.
They cover everything from setting up the initial project to providing a checklist for deploying to production.

See [PWA Studio fundamentals][] for a list of these tutorials.

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                             | Change type | PR        |
| --------------------------------------------------------------------------------------- | ----------- | --------- |
| Created a new Portal component                                                          | **Feature** | [#2436][] |
| Added support for png image requests for servers that cannot handle `webp`              | **Feature** | [#2400][] |
| Implemented UX around $0 total checkout                                                 | **Feature** | [#2394][] |
| Implemented auto-population of shipping information when authenticated                  | **Feature** | [#2380][] |
| Implemented shopping cart merging on login                                              | **Feature** | [#2377][] |
| Added ability to specify ratio for image component                                      | **Feature** | [#2372][] |
| Implemented Checkout page price adjustments                                             | **Feature** | [#2366][] |
| Created a new Dialog Component                                                          | **Feature** | [#2365][] |
| Added Storybook to Venia concept for scaffolded projects                                | **Feature** | [#2355][] |
| Added a new CMS home page with Page Builder content                                     | **Feature** | [#2345][] |
| Implemented a guest payment workflow on the Checkout page                               | **Feature** | [#2320][] |
| Enabled the RadioGroup component to pass `rest` attributes to radio group items         | **Feature** | [#2313][] |
| Added sorting to search page                                                            | **Feature** | [#2294][] |
| Created new Order Confirmation page                                                     | **Feature** | [#2288][] |
| Created Items Review component for Cart and Checkout                                    | **Feature** | [#2257][] |
| Added property to specify the cart trigger color                                        | **Feature** | [#2220][] |
| Updated home page route                                                                 | **Update**  | [#2565][] |
| Renamed identities to be culturally appropriate                                         | **Update**  | [#2478][] |
| Updated Cart page to show loading state while fetching data from network                | **Update**  | [#2454][] |
| Updated cache policy for Home page                                                      | **Update**  | [#2453][] |
| Swapped usage of React Head to React Helmet Async                                       | **Update**  | [#2412][] |
| Updated Service Worker to be more strict when doing catalog image checks                | **Update**  | [#2392][] |
| Removed reference related to recently viewed items                                      | **Update**  | [#2387][] |
| Changed the accordion section buttons to type `button`                                  | **Update**  | [#2335][] |
| Changed the Venia loading spinner image to a simpler CSS spinner                        | **Update**  | [#2310][] |
| Added check for the `isRequired` validation rule                                        | **Update**  | [#2303][] |
| Implemented Shipping Information form for guest checkout                                | **Update**  | [#2285][] |
| Added Shipping Methods form to Checkout page                                            | **Update**  | [#2280][] |
| Made minor updates to the Order Summary feature                                         | **Update**  | [#2278][] |
| Styled icons with CSS                                                                   | **Update**  | [#2272][] |
| Added the Order Summary to the Checkout page                                            | **Update**  | [#2271][] |
| Cleaned and made Cart and Checkout pages consistent                                     | **Update**  | [#2258][] |
| Updated Checkout page GraphQL query                                                     | **Update**  | [#2254][] |
| Added category description (with PageBuilder support as well) in the category view      | **Update**  | [#2226][] |
| Updated cms component to include meta data                                              | **Update**  | [#2159][] |
| Changed the random swatch color to the actual color                                     | **Update**  | [#2151][] |
| Fixed a button clipping bug                                                             | **Bugfix**  | [#2499][] |
| Fixed a Mini Cart bug that displayed incorrect dimensions and spacing for swatch images | **Bugfix**  | [#2457][] |
| Fixed dropdown arrows in Firefox                                                        | **Bugfix**  | [#2455][] |
| Fixed price summary not updating when shipping info is updated                          | **Bugfix**  | [#2445][] |
| Fixed css on the Checkout page                                                          | **Bugfix**  | [#2416][] |
| Fixed bug in Mini Cart where product options should be on separate lines                | **Bugfix**  | [#2393][] |
| Fixed a Service Worker HTML caching bug                                                 | **Bugfix**  | [#2390][] |
| Fixed an incorrect `propType` in order confirmation page                                | **Bugfix**  | [#2375][] |
| Fixed a bug where Magento2 media image would not load                                   | **Bugfix**  | [#2339][] |
| Fixed checkout button props                                                             | **Bugfix**  | [#2334][] |
| Added a white stroke to the checkout button css in Mini Cart                            | **Bugfix**  | [#2330][] |
| Fixed bug where a scroll position would not reset on router change                      | **Bugfix**  | [#2309][] |
| Fixed a css var in the checkbox.css                                                     | **Bugfix**  | [#2307][] |
| Fixed a rounding error on image src set                                                 | **Bugfix**  | [#2300][] |
| Fixed font size on the Order Summary page                                               | **Bugfix**  | [#2275][] |
| Removed a duplicate css property                                                        | **Bugfix**  | [#2248][] |
| Fixed the placement of next and previous button for the Carousel component in Chrome    | **Bugfix**  | [#2512][] |

### Peregrine library

| Description                                                                                    | Change type | PR        |
| ---------------------------------------------------------------------------------------------- | ----------- | --------- |
| Created a new `useSort()` hook for sorting logic                                               | **Feature** | [#2343][] |
| Added code for handling invalid braintree nonce error while placing order                      | **Update**  | [#2405][] |
| Updated app to preselect the lowest cost shipping method for authenticated users without one   | **Update**  | [#2402][] |
| Fixed a race condition during order placement after details have been fetched                  | **Bugfix**  | [#2486][] |
| Fixed a bug where the price does not get updated after changing the color/size                 | **Bugfix**  | [#2483][] |
| Fixed shipping method loading error                                                            | **Bugfix**  | [#2481][] |
| Fixed country list so that it uses abbreviation for the label if english text is not available | **Bugfix**  | [#2476][] |
| Fixed gift card flashing on error                                                              | **Bugfix**  | [#2462][] |
| Fixed a bug where updating the sort criteria does not reset the paging                         | **Bugfix**  | [#2458][] |
| Fixed a bug where Country/Region list occasionally resets initial value                        | **Bugfix**  | [#2456][] |
| Fixed order confirmation page refreshing multiple times                                        | **Bugfix**  | [#2433][] |
| Addressed the GraphQL warning thrown during build                                              | **Bugfix**  | [#2421][] |
| Fixed a bug causing the checkout shipping method flashing of old content                       | **Bugfix**  | [#2382][] |
| Fixed a bug in Mini Cart caused by an expired auth token                                       | **Bugfix**  | [#2379][] |
| Fixed an inadvertent error message associated with checkout shipping methods                   | **Bugfix**  | [#2371][] |
| Fixed a persistence bug during the checkout step between refreshes                             | **Bugfix**  | [#2354][] |
| Fixed bug in the quantity stepper when `initialValue` changes                                  | **Bugfix**  | [#2353][] |
| Fixed a bug where the price summary would not get updated after removing an item.              | **Bugfix**  | [#2329][] |
| Fixed a bug with sensitive data on logout, login, and checkout                                 | **Bugfix**  | [#2322][] |
| Fixed a bug in the create account process where the subscribe flag is not set                  | **Bugfix**  | [#2265][] |
| Fixed wrong value type used in `useCategoryTree.js`                                            | **Bugfix**  | [#2243][] |
| Fixed input errors in the Cart and Checkout pages                                              | **Bugfix**  | [#2495][] |

### Build tools

| Description                                                                               | Change type | PR        |
| ----------------------------------------------------------------------------------------- | ----------- | --------- |
| Added more extension points and JSDocs for the extensibility framework                    | **Feature** | [#2298][] |
| Added ability to provide Page Builder Content Type configurations dynamically             | **Feature** | [#2131][] |
| Upgraded `graphql-playground-middleware-express` dependency                               | **Update**  | [#2482][] |
| Fixed a broken sort function                                                              | **Bugfix**  | [#2497][] |
| Removed unintentionally spammy `loadEnvironment` warnings                                 | **Bugfix**  | [#2466][] |
| Fixed an unhandled error in the dev server                                                | **Bugfix**  | [#2420][] |
| Added a preinstall script that prevents `npm install` and requires `yarn install` instead | **Bugfix**  | [#2384][] |

### Documentation

| Description                                                      | Change type       | PR        |
| ---------------------------------------------------------------- | ----------------- | --------- |
| Published production launch checklist topic                      | **Documentation** | [#2440][] |
| Published graphql tutorial                                       | **Documentation** | [#2432][] |
| Published state management tutorial                              | **Documentation** | [#2399][] |
| Added an input section to the styleguide                         | **Documentation** | [#2360][] |
| Published a community-driven FAQ page                            | **Documentation** | [#2358][] |
| Published css modules tutorial                                   | **Documentation** | [#2341][] |
| Published component props tutorial                               | **Documentation** | [#2324][] |
| Added new tutorial about using SASS and LESS                     | **Documentation** | [#2316][] |
| Published the update footer tutorial                             | **Documentation** | [#2299][] |
| Published project structure topic                                | **Documentation** | [#2214][] |
| Clarified entry about optional sample data                       | **Update**        | [#2474][] |
| Implemented minor doc site updates                               | **Update**        | [#2388][] |
| Updated search index for the Magento User Guide                  | **Update**        | [#2418][] |
| Implemented Spectrum redesign for docs                           | **Update**        | [#2386][] |
| Added extra information in the FAQ for using the image component | **Update**        | [#2383][] |
| Added FAQ section on how to query different storeviews           | **Update**        | [#2381][] |
| Updated the Cloud Deploy tutorial                                | **Update**        | [#2319][] |
| Updated styleguide colors & typography                           | **Update**        | [#2236][] |
| Removed an unwanted link                                         | **Update**        | [#2202][] |
| Corrected mispelling in 'Introduction to React'                  | **Bugfix**        | [#2487][] |
| Fixed Modal/Portal reference doc generation                      | **Bugfix**        | [#2450][] |
| Fixed content in Cloud Deploy topic                              | **Bugfix**        | [#2398][] |

### Misc

| Description                                                               | Change type | PR                  |
| ------------------------------------------------------------------------- | ----------- | ------------------- |
| Bumped `websocket-extensions` dependency from 0.1.3 to 0.1.4              | **Update**  | [#2465][]           |
| Bumped `apollo-server` dependency from 2.6.9 to 2.14.2                    | **Update**  | [#2464][]           |
| Added Lars Roettig to the list of Community Maintainers                   | **Update**  | [#2439][] [#2293][] |
| Updated pull request template to use valid markdown syntax for checkboxes | **Update**  | [#2434][]           |
| Updated docker image                                                      | **Update**  | [#2406][]           |
| Updated pull request template                                             | **Update**  | [#2389][]           |
| Renamed docker file to get syntax highlighting                            | **Update**  | [#2374][]           |
| Bumped jquery from 3.4.1 to 3.5.0 in pwa-devdocs project directory        | **Update**  | [#2370][]           |
| Updated the node version in venia-concept to allow Node >=10.x            | **Update**  | [#2315][]           |
| Bumped acorn from 5.7.3 to 5.7.4                                          | **Update**  | [#2312][]           |
| Fixed `https-proxy-agent` dependency issue                                | **Bugfix**  | [#2356][]           |

## Known issues

- A new Mini Cart is in development which removes the checkout flow in favor of the standalone Checkout page.
  An issue exists in the checkout section of the old Mini Cart where the **Pay with Card** header does not appear on the Credit Card payment form.
  This issue is low priority since the old Mini Cart will be replaced with the new one in future releases.

## Upgrading from a previous version

The method for updating to 7.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
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

To upgrade to 7.0.0, update the project's `package.json` file and change the version string for any PWA Studio package dependencies.

[pwa studio releases]: https://github.com/magento/pwa-studio/releases

[`venia-ui-declare.js`]: https://github.com/magento/pwa-studio/blob/release/7.0/packages/venia-ui/lib/targets/venia-ui-declare.js
[`peregrine-declare.js`]: https://github.com/magento/pwa-studio/blob/release/7.0/packages/peregrine/lib/targets/peregrine-declare.js
[`declare-base.js`]: https://github.com/magento/pwa-studio/blob/release/7.0/packages/pwa-buildpack/lib/BuildBus/declare-base.js
[dialog component]: https://github.com/magento/pwa-studio/tree/release/7.0/packages/venia-ui/lib/components/Dialog
[pwa studio fundamentals]: http://pwastudio.io/tutorials/pwa-studio-fundamentals/
[page builder]: https://magento.com/products/magento-commerce/page-builder

[#2499]: https://github.com/magento/pwa-studio/pull/2499
[#2497]: https://github.com/magento/pwa-studio/pull/2497
[#2490]: https://github.com/magento/pwa-studio/pull/2490
[#2488]: https://github.com/magento/pwa-studio/pull/2488
[#2487]: https://github.com/magento/pwa-studio/pull/2487
[#2486]: https://github.com/magento/pwa-studio/pull/2486
[#2483]: https://github.com/magento/pwa-studio/pull/2483
[#2482]: https://github.com/magento/pwa-studio/pull/2482
[#2481]: https://github.com/magento/pwa-studio/pull/2481
[#2480]: https://github.com/magento/pwa-studio/pull/2480
[#2478]: https://github.com/magento/pwa-studio/pull/2478
[#2477]: https://github.com/magento/pwa-studio/pull/2477
[#2476]: https://github.com/magento/pwa-studio/pull/2476
[#2474]: https://github.com/magento/pwa-studio/pull/2474
[#2466]: https://github.com/magento/pwa-studio/pull/2466
[#2465]: https://github.com/magento/pwa-studio/pull/2465
[#2464]: https://github.com/magento/pwa-studio/pull/2464
[#2462]: https://github.com/magento/pwa-studio/pull/2462
[#2458]: https://github.com/magento/pwa-studio/pull/2458
[#2457]: https://github.com/magento/pwa-studio/pull/2457
[#2456]: https://github.com/magento/pwa-studio/pull/2456
[#2455]: https://github.com/magento/pwa-studio/pull/2455
[#2454]: https://github.com/magento/pwa-studio/pull/2454
[#2453]: https://github.com/magento/pwa-studio/pull/2453
[#2451]: https://github.com/magento/pwa-studio/pull/2451
[#2450]: https://github.com/magento/pwa-studio/pull/2450
[#2446]: https://github.com/magento/pwa-studio/pull/2446
[#2445]: https://github.com/magento/pwa-studio/pull/2445
[#2440]: https://github.com/magento/pwa-studio/pull/2440
[#2439]: https://github.com/magento/pwa-studio/pull/2439
[#2436]: https://github.com/magento/pwa-studio/pull/2436
[#2434]: https://github.com/magento/pwa-studio/pull/2434
[#2433]: https://github.com/magento/pwa-studio/pull/2433
[#2432]: https://github.com/magento/pwa-studio/pull/2432
[#2427]: https://github.com/magento/pwa-studio/pull/2427
[#2425]: https://github.com/magento/pwa-studio/pull/2425
[#2421]: https://github.com/magento/pwa-studio/pull/2421
[#2420]: https://github.com/magento/pwa-studio/pull/2420
[#2418]: https://github.com/magento/pwa-studio/pull/2418
[#2416]: https://github.com/magento/pwa-studio/pull/2416
[#2412]: https://github.com/magento/pwa-studio/pull/2412
[#2406]: https://github.com/magento/pwa-studio/pull/2406
[#2405]: https://github.com/magento/pwa-studio/pull/2405
[#2402]: https://github.com/magento/pwa-studio/pull/2402
[#2400]: https://github.com/magento/pwa-studio/pull/2400
[#2399]: https://github.com/magento/pwa-studio/pull/2399
[#2398]: https://github.com/magento/pwa-studio/pull/2398
[#2394]: https://github.com/magento/pwa-studio/pull/2394
[#2393]: https://github.com/magento/pwa-studio/pull/2393
[#2392]: https://github.com/magento/pwa-studio/pull/2392
[#2390]: https://github.com/magento/pwa-studio/pull/2390
[#2389]: https://github.com/magento/pwa-studio/pull/2389
[#2388]: https://github.com/magento/pwa-studio/pull/2388
[#2387]: https://github.com/magento/pwa-studio/pull/2387
[#2386]: https://github.com/magento/pwa-studio/pull/2386
[#2384]: https://github.com/magento/pwa-studio/pull/2384
[#2383]: https://github.com/magento/pwa-studio/pull/2383
[#2382]: https://github.com/magento/pwa-studio/pull/2382
[#2381]: https://github.com/magento/pwa-studio/pull/2381
[#2380]: https://github.com/magento/pwa-studio/pull/2380
[#2379]: https://github.com/magento/pwa-studio/pull/2379
[#2377]: https://github.com/magento/pwa-studio/pull/2377
[#2375]: https://github.com/magento/pwa-studio/pull/2375
[#2374]: https://github.com/magento/pwa-studio/pull/2374
[#2372]: https://github.com/magento/pwa-studio/pull/2372
[#2371]: https://github.com/magento/pwa-studio/pull/2371
[#2370]: https://github.com/magento/pwa-studio/pull/2370
[#2368]: https://github.com/magento/pwa-studio/pull/2368
[#2367]: https://github.com/magento/pwa-studio/pull/2367
[#2366]: https://github.com/magento/pwa-studio/pull/2366
[#2365]: https://github.com/magento/pwa-studio/pull/2365
[#2362]: https://github.com/magento/pwa-studio/pull/2362
[#2360]: https://github.com/magento/pwa-studio/pull/2360
[#2358]: https://github.com/magento/pwa-studio/pull/2358
[#2356]: https://github.com/magento/pwa-studio/pull/2356
[#2355]: https://github.com/magento/pwa-studio/pull/2355
[#2354]: https://github.com/magento/pwa-studio/pull/2354
[#2353]: https://github.com/magento/pwa-studio/pull/2353
[#2345]: https://github.com/magento/pwa-studio/pull/2345
[#2343]: https://github.com/magento/pwa-studio/pull/2343
[#2341]: https://github.com/magento/pwa-studio/pull/2341
[#2339]: https://github.com/magento/pwa-studio/pull/2339
[#2335]: https://github.com/magento/pwa-studio/pull/2335
[#2334]: https://github.com/magento/pwa-studio/pull/2334
[#2330]: https://github.com/magento/pwa-studio/pull/2330
[#2329]: https://github.com/magento/pwa-studio/pull/2329
[#2324]: https://github.com/magento/pwa-studio/pull/2324
[#2322]: https://github.com/magento/pwa-studio/pull/2322
[#2320]: https://github.com/magento/pwa-studio/pull/2320
[#2319]: https://github.com/magento/pwa-studio/pull/2319
[#2316]: https://github.com/magento/pwa-studio/pull/2316
[#2315]: https://github.com/magento/pwa-studio/pull/2315
[#2313]: https://github.com/magento/pwa-studio/pull/2313
[#2312]: https://github.com/magento/pwa-studio/pull/2312
[#2310]: https://github.com/magento/pwa-studio/pull/2310
[#2309]: https://github.com/magento/pwa-studio/pull/2309
[#2307]: https://github.com/magento/pwa-studio/pull/2307
[#2303]: https://github.com/magento/pwa-studio/pull/2303
[#2300]: https://github.com/magento/pwa-studio/pull/2300
[#2299]: https://github.com/magento/pwa-studio/pull/2299
[#2298]: https://github.com/magento/pwa-studio/pull/2298
[#2294]: https://github.com/magento/pwa-studio/pull/2294
[#2293]: https://github.com/magento/pwa-studio/pull/2293
[#2288]: https://github.com/magento/pwa-studio/pull/2288
[#2285]: https://github.com/magento/pwa-studio/pull/2285
[#2280]: https://github.com/magento/pwa-studio/pull/2280
[#2278]: https://github.com/magento/pwa-studio/pull/2278
[#2275]: https://github.com/magento/pwa-studio/pull/2275
[#2272]: https://github.com/magento/pwa-studio/pull/2272
[#2271]: https://github.com/magento/pwa-studio/pull/2271
[#2267]: https://github.com/magento/pwa-studio/pull/2267
[#2265]: https://github.com/magento/pwa-studio/pull/2265
[#2258]: https://github.com/magento/pwa-studio/pull/2258
[#2257]: https://github.com/magento/pwa-studio/pull/2257
[#2254]: https://github.com/magento/pwa-studio/pull/2254
[#2248]: https://github.com/magento/pwa-studio/pull/2248
[#2243]: https://github.com/magento/pwa-studio/pull/2243
[#2236]: https://github.com/magento/pwa-studio/pull/2236
[#2226]: https://github.com/magento/pwa-studio/pull/2226
[#2220]: https://github.com/magento/pwa-studio/pull/2220
[#2214]: https://github.com/magento/pwa-studio/pull/2214
[#2202]: https://github.com/magento/pwa-studio/pull/2202
[#2159]: https://github.com/magento/pwa-studio/pull/2159
[#2151]: https://github.com/magento/pwa-studio/pull/2151
[#2131]: https://github.com/magento/pwa-studio/pull/2131
[#2495]: https://github.com/magento/pwa-studio/pull/2495
[#2512]: https://github.com/magento/pwa-studio/pull/2512
[#2565]: https://github.com/magento/pwa-studio/pull/2565
