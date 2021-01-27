# Release 9.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 9.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 9.0.0](#whats-new-in-900)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Known issues](#known-issues)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 9.0.0

PWA Studio 9.0.0 contains new features, refactors, and various improvements.

### Extensibility framework improvements

This release adds several improvements to the extensibility framework in PWA Studio to make it easier for developers to customize their storefronts.
For an overview of this framework, check out the new [Extensibility framework][] topic on the docs site.

In previous releases, Peregrine talons had limited Target coverage.
This release adds an automatic API generator to Peregrine that exposes all hooks and talons as Targets.
Now, existing and future hooks and talons in Peregrine automatically get their own Targets API that developers may use to modify or extend functionality.

This release also adds the _Targetables_ feature to the extensibility framework.
These represent source files used in your PWA Studio project, and
they give developers the ability to change the source code during the build process.
With Targetables, developers no longer have to copy PWA Studio source code into their storefront projects to make minor modifications.

[extensibility framework]: <https://pwastudio.io/pwa-buildpack/extensibility-framework/>

### PWA Studio extensions

PWA Studio's extensibility framework lets developers create extensions and install them as project dependencies in their storefronts.
As part of the work on the new extensibility framework, we refactored and relocated existing Venia features into PWA Studio extensions.
We also developed new extensions that provide useful Venia features that developers can add to their projects.

The source code for these extensions are available under the [`packages/extensions`][] directory in the PWA Studio repository.

`upward-security-headers`
: intercepts build targets to add security headers to UPWARD

`venia-adobe-data-layer`
: provides [Adobe Client Data Layer][] support for your project

`venia-sample-backends`
: provides demo Magento backends and backend validation utilities for your project
  (this extension should be removed prior to going live)

`venia-sample-language-packs`
: provides example translations to illustrate how new languages can be installed into your storefronts

[`packages/extensions`]: <https://github.com/magento/pwa-studio/tree/release/9.0/packages/extensions>
[adobe client data layer]: <https://github.com/adobe/adobe-client-data-layer/wiki>

### Internationalization and localization

The internationalization(i18n) feature in PWA Studio lets developers localize their storefront content according to different regions and languages.
The Magento backend provides your storefront with this list of regions and languages and the I18n feature provides translated content using PWA Studio language pack extensions.

As part of the i18n feature work, we refactored Venia UI components and gave them the ability to display the correct translations for multi-language storefronts.

This release also gives developers the ability to develop and install PWA Studio language packages as NPM dependencies.
An example of a language pack extension is in the [`packages/extensions`][] directory in the PWA Studio repository.

For more information, read the new topic on the [Localization feature][].

[localization feature]: <https://pwastudio.io/technologies/basic-concepts/internationalization/>

### My Account

This release adds components that support _My Account_ features for customers that create an account with a store.

My Account features included in this release:

- Wishlist
- Saved Payments
- Address Book
- Order History

### Increased test coverage

Our continued commitment to stability and quality has seen an increase in overall unit test code coverage.

Coverage as reported by [coveralls.io][]:

Current coverage (9.0.0)
: **84.19%**

Previous coverage (8.0.0)
: **79.21%**

[coveralls.io]: <https://coveralls.io/github/magento/pwa-studio>

### Magento release support change

Previous releases of PWA Studio supported multiple versions of the Magento back-end.
To help us deliver value faster, we modified our support matrix.

Starting with PWA Studio & Venia 9.0.0, we will only support the most recent version of Magento.
For example, version 9.0.0 only supports Magento 2.4.2.
Minor versions of PWA Studio & Venia released between typical Magento releases will support the last publicly available release.

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                                             | Change type  | PR        |
| ------------------------------------------------------------------------------------------------------- | ------------ | --------- |
| Created UI skeleton for Saved Payments                                                                  | **Feature**  | [#2671][] |
| Created component for displaying account information                                                    | **Feature**  | [#2672][] |
| Added ability for shoppers to change locale using a store view switcher                                 | **Feature**  | [#2686][] |
| Created the main view for Wishlist                                                                      | **Feature**  | [#2692][] |
| Added the expanded view in the order history table                                                      | **Feature**  | [#2703][] |
| Created a currency switcher component                                                                   | **Feature**  | [#2728][] |
| Added `USE_STORE_CODE_IN_URL` environment variable configuration                                        | **Feature**  | [#2735][] |
| Created Wishlist UI                                                                                     | **Feature**  | [#2766][] |
| Added ability to determine whether to unmount or just hide child components in the Dialog component     | **Feature**  | [#2767][] |
| Added ability to remove products from Wishlist                                                          | **Feature**  | [#2793][] |
| Added a "maskable icon" to Venia for Google Lighthouse                                                  | **Feature**  | [#2818][] |
| Created message to display when no allowed or configured payment methods are present                    | **Feature**  | [#2855][] |
| Created the main view for Address Book in My Account                                                    | **Feature**  | [#2857][] |
| Added ability to Add and Edit addresses in the Address Book                                             | **Feature**  | [#2879][] |
| Created the main view for Saved payment methods                                                         | **Feature**  | [#2882][] |
| Added ability to delete Address from Address Book                                                       | **Feature**  | [#2888][] |
| Created new Sign In view for Checkout flow                                                              | **Feature**  | [#2889][] |
| Updated logic for routes handling to accept an array of paths                                           | **Feature**  | [#2893][] |
| Replaced hardcoded root category id with an actual value retrieved from a query                         | **Feature**  | [#2902][] |
| Added search by order number feature to the order history page                                          | **Feature**  | [#2916][] |
| Added pagination for Order History                                                                      | **Feature**  | [#2928][] |
| Refactored Edit Payment to use Dialog component                                                         | **Refactor** | [#2806][] |
| Refactored Edit Product to use Dialog component                                                         | **Refactor** | [#2824][] |
| Refactored Payment feature to make it extendable                                                        | **Refactor** | [#2838][] |
| Added access to checkout's `useOverview()` talon                                                        | **Update**   | [#2636][] |
| Updated the Search trigger button in the site header to behave like My Account and Cart trigger buttons | **Update**   | [#2685][] |
| Replaced the ProductQuantity component on the Product page with a QuantityFields stepper component      | **Update**   | [#2690][] |
| Localized My Account and Signed In sidebar                                                              | **Update**   | [#2721][] |
| Localized Mini Cart and Search                                                                          | **Update**   | [#2734][] |
| Localized Cart                                                                                          | **Update**   | [#2740][] |
| Localized Checkout page                                                                                 | **Update**   | [#2759][] |
| Localized CMS                                                                                           | **Update**   | [#2764][] |
| Localized Category page                                                                                 | **Update**   | [#2771][] |
| Localized Product page                                                                                  | **Update**   | [#2772][] |
| Localized Form Validators                                                                               | **Update**   | [#2781][] |
| Localized additional client-side strings                                                                | **Update**   | [#2799][] |
| Removed temp code                                                                                       | **Update**   | [#2811][] |
| Update service worker logic to handle all Venia images                                                  | **Update**   | [#2846][] |
| Fixed a bug where the Zip code field does not get cleared when switching country                        | **Bugfix**   | [#2680][] |
| Fixed a bug where the Filter and Sort buttons would not display at same time                            | **Bugfix**   | [#2681][] |
| Removed ability to submit form data prefixed/suffixed with spaces for all fields                        | **Bugfix**   | [#2749][] |
| Limited clickable link area for the product name on the product page                                    | **Bugfix**   | [#2755][] |
| Fixed message on the Search Page when searching for less than 3 characters                              | **Bugfix**   | [#2756][] |
| Fixed a bug where clicking on a Label would not focus Input                                             | **Bugfix**   | [#2774][] |
| Fixed `theme_color` value in the `manifest.json`                                                        | **Bugfix**   | [#2823][] |
| Fixed button type on product image carousel thumbnails                                                  | **Bugfix**   | [#2844][] |
| Fixed Service Worker caching for home page routes with store code                                       | **Bugfix**   | [#2856][] |

### Peregrine library

| Description                                                                                 | Change type  | PR        |
| ------------------------------------------------------------------------------------------- | ------------ | --------- |
| Created a shallow merge utility for classes in UI components and merge operations in talons | **Feature**  | [#2794][] |
| Increased `useApp()` talon test coverage                                                    | **Update**   | [#2782][] |
| Increased `peregrine/lib/apollo` test coverage                                              | **Update**   | [#2785][] |
| Increased CartPage test coverage                                                            | **Update**   | [#2847][] |
| Improved RootComponents talons test coverage                                                | **Update**   | [#2896][] |
| Removed routes to features still in progress                                                | **Update**   | [#2918][] |
| Migrated GQL related files and folders to the `peregrine` package                           | **Refactor** | [#2712][] |
| Removed the `@client` directive in Order History queries                                    | **Refactor** | [#2786][] |
| Fixed spelling for a function name                                                          | **Refactor** | [#2807][] |
| Refactored MagentoRoute to use ApolloClient                                                 | **Refactor** | [#2859][] |
| Moved product detail GraphQl fields to fragment                                             | **Refactor** | [#2868][] |
| Fixed JavaScript errors thrown by the `useOrderConfirmationPage` talon                      | **Bugfix**   | [#2850][] |
| Fixed `apiBase` URL in `resolveUnknownRoute.js`                                             | **Bugfix**   | [#2877][] |
| Fixed broken top level category navigation                                                  | **Bugfix**   | [#2911][] |
| Fixed offline cached search and category pages                                              | **Bugfix**   | [#2929][] |

### Build tools

| Description                                                               | Change type | PR        |
| ------------------------------------------------------------------------- | ----------- | --------- |
| Enabled PWA Studio packages and extensions to provide translations        | **Feature** | [#2696][] |
| Added support for GIF files in Webpack config                             | **Feature** | [#2714][] |
| Created Targetables feature and expanded Peregrine talons Target coverage | **Feature** | [#2765][] |
| Enabled self-signed certificates for backend validation                   | **Feature** | [#2891][] |
| Fixed unsupported webp image format for Safari                            | **Bugfix**  | [#2778][] |
| Fixed bug related to `apicache` overriding good cache headers             | **Bugfix**  | [#2870][] |
| Fixed missing `projectConfig` in `create-custom-origin` command           | **Bugfix**  | [#2897][] |

### Extensions

| Description                                                                                  | Change type | PR        |
| -------------------------------------------------------------------------------------------- | ----------- | --------- |
| Enable async tapping of Targets                                                              | **Feature** | [#2718][] |
| Added i18n feature as an extension with French language pack included                        | **Feature** | [#2840][] |
| Added the Adobe Client Data Layer as an extension                                            | **Feature** | [#2852][] |
| Added new extension to pick from multiple sample backends                                    | **Feature** | [#2853][] |
| Updated PageBuilder form field/field group viewport to read non-media styles                 | **Update**  | [#2881][] |
| Converted PageBuilder style blocks to inline styles to prevent backward incompatible changes | **Bugfix**  | [#2694][] |

### Documentation

| Description                                                                  | Change type       | PR        |
| ---------------------------------------------------------------------------- | ----------------- | --------- |
| Created docs for the Internationalization feature                            | **Documentation** | [#2741][] |
| Created a new tutorial for intercepting talons                               | **Documentation** | [#2777][] |
| Created a new tutorial on how to use environment variables in front end code | **Documentation** | [#2819][] |
| Created extensibility framework overview topic                               | **Documentation** | [#2863][] |
| Removed "scroll to top" code in GraphQL tutorial                             | **Update**        | [#2715][] |
| Update code sample in static route tutorial                                  | **Update**        | [#2725][] |
| Updated extensibility doc with minor fixes                                   | **Update**        | [#2742][] |
| Updated code samples in tutorial                                             | **Update**        | [#2746][] |
| Added info about RAIL model                                                  | **Update**        | [#2761][] |
| Added the Adobe logo to the doc site header                                  | **Update**        | [#2812][] |
| Updated cloud deployment topic                                               | **Update**        | [#2871][] |
| Refactored tutorials section                                                 | **Refactor**      | [#2907][] |
| Removed duplicate word from doc                                              | **Bugfix**        | [#2865][] |

### Misc

| Description                                                                   | Change type | PR        |
| ----------------------------------------------------------------------------- | ----------- | --------- |
| Removed the `venia-styleguide` package                                        | **Update**  | [#2706][] |
| Update use of `Whitelist` to `Allowlist`                                      | **Update**  | [#2779][] |
| Added `jsx-no-literals` linting rule                                          | **Update**  | [#2789][] |
| Update PR template to add translation entry to checklist                      | **Update**  | [#2800][] |
| Fixed a Storybook bug related to `fetchLocaleData` in storybook config        | **Bugfix**  | [#2801][] |
| Fix failing unit tests related to race conditions                             | **Bugfix**  | [#2880][] |
| Fixed a Storybook bug related to the relative import of a local custom loader | **Bugfix**  | [#2912][] |

## Known issues

- If you are using Multi-Source Inventory(MSI), a GraphQL issue prevents users from adding a configurable product to the shopping cart on non-default store views.
- Prerender feature is unable to cache HTML on Fastly enabled environments.
- The `yarn watch` process may run out of memory if left running for an extended amount of time.
  If an error occurs because of this, restart the watcher.

## Upgrading from a previous version

The method for updating to 9.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
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

To upgrade to the latest version (currently 9.0.0), simply call `yarn add` on each of the `@magento` packages. This will both update `package.json` in your project, as well as install the latest versions.

Sample command:

```
yarn add @magento/eslint-config @magento/pagebuilder @magento/peregrine @magento/pwa-buildpack @magento/upward-js @magento/venia-ui
```

[pwa studio releases]: https://github.com/magento/pwa-studio/releases

[#2912]: https://github.com/magento/pwa-studio/pull/2912
[#2911]: https://github.com/magento/pwa-studio/pull/2911
[#2907]: https://github.com/magento/pwa-studio/pull/2907
[#2902]: https://github.com/magento/pwa-studio/pull/2902
[#2897]: https://github.com/magento/pwa-studio/pull/2897
[#2896]: https://github.com/magento/pwa-studio/pull/2896
[#2893]: https://github.com/magento/pwa-studio/pull/2893
[#2891]: https://github.com/magento/pwa-studio/pull/2891
[#2889]: https://github.com/magento/pwa-studio/pull/2889
[#2888]: https://github.com/magento/pwa-studio/pull/2888
[#2882]: https://github.com/magento/pwa-studio/pull/2882
[#2881]: https://github.com/magento/pwa-studio/pull/2881
[#2880]: https://github.com/magento/pwa-studio/pull/2880
[#2879]: https://github.com/magento/pwa-studio/pull/2879
[#2877]: https://github.com/magento/pwa-studio/pull/2877
[#2871]: https://github.com/magento/pwa-studio/pull/2871
[#2870]: https://github.com/magento/pwa-studio/pull/2870
[#2868]: https://github.com/magento/pwa-studio/pull/2868
[#2865]: https://github.com/magento/pwa-studio/pull/2865
[#2863]: https://github.com/magento/pwa-studio/pull/2863
[#2859]: https://github.com/magento/pwa-studio/pull/2859
[#2857]: https://github.com/magento/pwa-studio/pull/2857
[#2856]: https://github.com/magento/pwa-studio/pull/2856
[#2855]: https://github.com/magento/pwa-studio/pull/2855
[#2853]: https://github.com/magento/pwa-studio/pull/2853
[#2852]: https://github.com/magento/pwa-studio/pull/2852
[#2850]: https://github.com/magento/pwa-studio/pull/2850
[#2847]: https://github.com/magento/pwa-studio/pull/2847
[#2846]: https://github.com/magento/pwa-studio/pull/2846
[#2844]: https://github.com/magento/pwa-studio/pull/2844
[#2840]: https://github.com/magento/pwa-studio/pull/2840
[#2838]: https://github.com/magento/pwa-studio/pull/2838
[#2824]: https://github.com/magento/pwa-studio/pull/2824
[#2823]: https://github.com/magento/pwa-studio/pull/2823
[#2819]: https://github.com/magento/pwa-studio/pull/2819
[#2818]: https://github.com/magento/pwa-studio/pull/2818
[#2812]: https://github.com/magento/pwa-studio/pull/2812
[#2811]: https://github.com/magento/pwa-studio/pull/2811
[#2807]: https://github.com/magento/pwa-studio/pull/2807
[#2806]: https://github.com/magento/pwa-studio/pull/2806
[#2801]: https://github.com/magento/pwa-studio/pull/2801
[#2800]: https://github.com/magento/pwa-studio/pull/2800
[#2799]: https://github.com/magento/pwa-studio/pull/2799
[#2794]: https://github.com/magento/pwa-studio/pull/2794
[#2793]: https://github.com/magento/pwa-studio/pull/2793
[#2789]: https://github.com/magento/pwa-studio/pull/2789
[#2786]: https://github.com/magento/pwa-studio/pull/2786
[#2785]: https://github.com/magento/pwa-studio/pull/2785
[#2783]: https://github.com/magento/pwa-studio/pull/2783
[#2782]: https://github.com/magento/pwa-studio/pull/2782
[#2781]: https://github.com/magento/pwa-studio/pull/2781
[#2779]: https://github.com/magento/pwa-studio/pull/2779
[#2778]: https://github.com/magento/pwa-studio/pull/2778
[#2777]: https://github.com/magento/pwa-studio/pull/2777
[#2774]: https://github.com/magento/pwa-studio/pull/2774
[#2772]: https://github.com/magento/pwa-studio/pull/2772
[#2771]: https://github.com/magento/pwa-studio/pull/2771
[#2767]: https://github.com/magento/pwa-studio/pull/2767
[#2766]: https://github.com/magento/pwa-studio/pull/2766
[#2765]: https://github.com/magento/pwa-studio/pull/2765
[#2764]: https://github.com/magento/pwa-studio/pull/2764
[#2763]: https://github.com/magento/pwa-studio/pull/2763
[#2761]: https://github.com/magento/pwa-studio/pull/2761
[#2759]: https://github.com/magento/pwa-studio/pull/2759
[#2756]: https://github.com/magento/pwa-studio/pull/2756
[#2755]: https://github.com/magento/pwa-studio/pull/2755
[#2749]: https://github.com/magento/pwa-studio/pull/2749
[#2746]: https://github.com/magento/pwa-studio/pull/2746
[#2742]: https://github.com/magento/pwa-studio/pull/2742
[#2741]: https://github.com/magento/pwa-studio/pull/2741
[#2740]: https://github.com/magento/pwa-studio/pull/2740
[#2735]: https://github.com/magento/pwa-studio/pull/2735
[#2734]: https://github.com/magento/pwa-studio/pull/2734
[#2728]: https://github.com/magento/pwa-studio/pull/2728
[#2725]: https://github.com/magento/pwa-studio/pull/2725
[#2721]: https://github.com/magento/pwa-studio/pull/2721
[#2718]: https://github.com/magento/pwa-studio/pull/2718
[#2715]: https://github.com/magento/pwa-studio/pull/2715
[#2714]: https://github.com/magento/pwa-studio/pull/2714
[#2712]: https://github.com/magento/pwa-studio/pull/2712
[#2708]: https://github.com/magento/pwa-studio/pull/2708
[#2706]: https://github.com/magento/pwa-studio/pull/2706
[#2703]: https://github.com/magento/pwa-studio/pull/2703
[#2696]: https://github.com/magento/pwa-studio/pull/2696
[#2694]: https://github.com/magento/pwa-studio/pull/2694
[#2693]: https://github.com/magento/pwa-studio/pull/2693
[#2692]: https://github.com/magento/pwa-studio/pull/2692
[#2690]: https://github.com/magento/pwa-studio/pull/2690
[#2686]: https://github.com/magento/pwa-studio/pull/2686
[#2685]: https://github.com/magento/pwa-studio/pull/2685
[#2681]: https://github.com/magento/pwa-studio/pull/2681
[#2680]: https://github.com/magento/pwa-studio/pull/2680
[#2672]: https://github.com/magento/pwa-studio/pull/2672
[#2671]: https://github.com/magento/pwa-studio/pull/2671
[#2636]: https://github.com/magento/pwa-studio/pull/2636
[#2918]: https://github.com/magento/pwa-studio/pull/2918
[#2916]: https://github.com/magento/pwa-studio/pull/2916
[#2929]: https://github.com/magento/pwa-studio/pull/2929
[#2928]: https://github.com/magento/pwa-studio/pull/2928
