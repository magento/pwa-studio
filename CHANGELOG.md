# Release 6.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 6.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 6.0.0](#whats-new-in-600)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 6.0.0

PWA Studio 6.0.0 contains new features, refactors, and various improvements.

### Initial extensibility framework

This release contains initial work for an extensibility framework in PWA Studio.
This framework gives developers the ability to create an extensibility API for their storefront or write plugins that can tap into those API and modify storefront logic.

An example of this framework in action can be found in the Venia storefront, which exposes an API and installs the Page Builder PWA package as a dependency.

Previously the only way to add Page Builder features was to have a copy of the Page Builder module's source code inside the project itself.
This had the unfortunate side effect of you having to manually apply any code changes to your copy of Page Builder whenever a new version releases.
With the new extensibility framework, updating is as easy as installing the new version.

### Caching and data fetching improvements

This release contains improved caching logic and other data fetching optimizations in the Peregrine and Venia UI component libraries.
These components have been refactored to take advantage of Apollo cache features to reduce overfetching or prevent the storage of sensitive data.

### Shopping cart page components

This release adds components that can be used for a full page shopping cart experience.
The standalone cart page for Venia is still under development as of this release, but you can view the current progress at: https://develop.pwa-venia.com/cart

### PWA Studio tutorials

Since the last release, the [PWA Studio doc site](http://pwastudio.io/) has created a new tutorial section for [PWA Studio fundamentals](http://pwastudio.io/tutorials/pwa-studio-fundamentals/).
Topics in this section will be more instructional than the topics found in the **Getting started** section.

Currently, the following drafts have been published (with more to come):

-   [Project setup](http://pwastudio.io/tutorials/pwa-studio-fundamentals/project-setup/)
-   [Project structure](http://pwastudio.io/tutorials/pwa-studio-fundamentals/project-structure/)
-   [Add a static route](http://pwastudio.io/tutorials/pwa-studio-fundamentals/add-a-static-route/)

Thanks to community member [rossmc](https://github.com/rossmc) for contributing the drafts for this these topics!

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                              | Change type  |    PR     |
| :--------------------------------------------------------------------------------------- | :----------: | :-------: |
| Added current applied Gift Card balance to UI                                            | **Feature**  | [#2156][] |
| Added "Edit Item" feature from mini-cart into Cart Page kebab menu                       | **Feature**  | [#2191][] |
| Added an error toast for invalid Product quantities                                      | **Feature**  | [#2196][] |
| Created initial skeleton for a checkout page                                             | **Feature**  | [#2181][] |
| Implemented sorting for Category page                                                    | **Feature**  | [#2133][] |
| Added Gift Cards support to Cart page                                                    | **Feature**  | [#2124][] |
| Added Shipping Method to Cart page                                                       | **Feature**  | [#2123][] |
| Added a product quantity stepper to cart items                                           | **Feature**  | [#2115][] |
| Added Gift options support in cart page                                                  | **Feature**  | [#2114][] |
| Added intermediate level breadcrumbs                                                     | **Feature**  | [#2113][] |
| Added Cart Coupons functionality                                                         | **Feature**  | [#2108][] |
| Added Cart Price Summary to cart page                                                    | **Feature**  | [#2092][] |
| Created new ProductListing Component for cart page                                       | **Feature**  | [#2094][] |
| Added PriceAdjustments and Accordion components to cart page                             | **Feature**  | [#2090][] |
| Created a standalone Cart Page                                                           | **Feature**  | [#2084][] |
| Removed client-side Email Validation on Signin, Create Acount, and Forgot Password forms |  **Update**  | [#2157][] |
| Refactored JSX in some modules to follow standards for conditionals                      | **Refactor** | [#2200][] |
| Refactored usage of `isFastNetwork()` in service worker.                                 | **Refactor** | [#2193][] |
| Refactored Accordion component to close sections instead of unmounting them              | **Refactor** | [#2149][] |
| Refactored ErrorView to be more scalable                                                 | **Refactor** | [#2116][] |
| Refactored cart style to fit design intent                                               | **Refactor** | [#2104][] |
| Created Firefox-specific CSS to fix text alignment issues                                |  **Bugfix**  | [#2233][] |
| Fixed Email field validation bug in Billing Information by removing field                |  **Bugfix**  | [#2216][] |
| Fixed style for quantity field/steppers in Firefox                                       |  **Bugfix**  | [#2206][] |
| Fixed Cart page sign out error when cart does not exist in cache                         |  **Bugfix**  | [#2189][] |
| Fixed a bug in the Cart page where items showed incorrect configurable options           |  **Bugfix**  | [#2167][] |
| Fixed a bug related to search trigger focus                                              |  **Bugfix**  | [#2165][] |
| Fixed venia-static files not loading out-of-the box with scaffolding command             |  **Bugfix**  | [#2143][] |
| Fixed the incorrect export for PriceSummaryQuery                                         |  **Bugfix**  | [#2142][] |
| Fixed incorrect cart page title                                                          |  **Bugfix**  | [#2140][] |
| Updated informed version to fix Windows 10/Edge issues                                   |  **Bugfix**  | [#2129][] |
| Fixed bug that rendered price components when cart is empty                              |  **Bugfix**  | [#2112][] |
| Fixed validator for venia-ui                                                             |  **Bugfix**  | [#2095][] |
| Fixed search result counts not matching in different components                          |  **Bugfix**  | [#2037][] |

### Peregrine library

| Description                                                                                        | Change type  |    PR     |
| :------------------------------------------------------------------------------------------------- | :----------: | :-------: |
| Enabled mutation queueing to prevent race conditions when multiple mutations are in flight         | **Feature**  | [#2215][] |
| Adds validation and input trimming for Gift Card input field                                       | **Feature**  | [#2175][] |
| Enabled real Filtering functionality by connect to GraphQL                                         | **Feature**  | [#2166][] |
| Refactored Apollo cache use to prevent overfetching                                                | **Refactor** | [#2250][] |
| Removed mutation PII while still updating the cache correctly                                      | **Refactor** | [#2240][] |
| Fixed a bug with the breadcrumbs in the Product Details Page talon for products without categories |  **Bugfix**  | [#2224][] |
| Fixed bug that showed stale suggestions during searches                                            |  **Bugfix**  | [#2150][] |
| Fixed Accordion talon bugs that kept resetting sections                                            |  **Bugfix**  | [#2147][] |

### Page Builder plugin

| Description                                                                                 | Change type |    PR     |
| :------------------------------------------------------------------------------------------ | :---------: | :-------: |
| Re-implemented Page Builder as an extension                                                 | **Feature** | [#2137][] |
| Added support for Page Builder's Video Background feature                                   | **Feature** | [#2187][] |
| Fixed video alignment background in embedded videos                                         | **Bugfix**  | [#2201][] |
| Fixed bug that would cause extensions utilizing Page Builder to break when upgraded         | **Bugfix**  | [#2199][] |
| Fixed bug where Row Full-Width contents were horizontally positioned incorrectly in desktop | **Bugfix**  | [#2146][] |
| Fixed escaped HTML bug that broke the HTML content type                                     | **Bugfix**  | [#2283][] |

### Build tools

| Description                                                                                 | Change type  |    PR     |
| :------------------------------------------------------------------------------------------ | :----------: | :-------: |
| Added interception targets for environmental variables                                      | **Feature**  | [#2174][] |
| Add ability to conditionally bundle CE or EE features in Venia                              | **Feature**  | [#2121][] |
| Changed default value and docs for DEV_SERVER_SERVICE_WORKER_ENABLED environment variable   |  **Update**  | [#2148][] |
| Refactored image processing for 5x faster streaming image optimization with no SSL failures | **Refactor** | [#2005][] |
| Fixed `RootComponentsPlugin` to be IE compatible                                            |  **Bugfix**  | [#2169][] |
| Removed out of the box tests from scaffolding command                                       |  **Bugfix**  | [#2321][] |
| Fixed missing extension files in newly scaffolded projects                                  |  **Bugfix**  | [#2305][] |

### UPWARD

| Description               | Change type |    PR     |
| :------------------------ | :---------: | :-------: |
| Fixed binary file reading | **Bugfix**  | [#2050][] |

### Documentation

| Description                                                                   |    Change type    |    PR     |
| :---------------------------------------------------------------------------- | :---------------: | :-------: |
| Revised and published PWA Studio fundamentals intro and project setup topics  | **Documentation** | [#2179][] |
| Created new tutorial for adding a static route                                | **Documentation** | [#2249][] |
| Added updates to updates-to-into-project-setup draft                          |     **Draft**     | [#2083][] |
| Added preparing-to-go-live tutorial draft doc                                 |     **Draft**     | [#2081][] |
| Added manage-state-with-redux tutorial draft doc                              |     **Draft**     | [#2079][] |
| Added use-magentos-graphql-api tutorial draft doc                             |     **Draft**     | [#2077][] |
| Added explore-graphql tutorial draft doc                                      |     **Draft**     | [#2075][] |
| Added reuse-a-venia-component tutorial draft doc                              |     **Draft**     | [#2073][] |
| Added component-state tutorial draft doc                                      |     **Draft**     | [#2071][] |
| Added css-modules tutorial draft doc                                          |     **Draft**     | [#2069][] |
| Added props-proptypes tutorial draft doc                                      |     **Draft**     | [#2067][] |
| Added update-site-footer tutorial draft doc                                   |     **Draft**     | [#2065][] |
| Added add-a-static-route tutorial draft doc                                   |     **Draft**     | [#2063][] |
| Added project-structure-and-routing tutorial draft doc                        |     **Draft**     | [#2061][] |
| Updated Cloud deployment topic                                                |    **Update**     | [#2235][] |
| Updated code block in doc to better work with copying and pasting             |    **Update**     | [#2229][] |
| Updated the contribution guide                                                |    **Update**     | [#2218][] |
| Updated dependencies and build script                                         |    **Update**     | [#2195][] |
| Updated setup topic                                                           |    **Update**     | [#2192][] |
| Updated contribution guidelines to make explicit the need to sign Adobe's CLA |    **Update**     | [#2125][] |
| Fixed broken reference doc generator                                          |    **Bugfix**     | [#2183][] |
| Added a missing variable in a topic                                           |    **Bugfix**     | [#2153][] |

### Misc

| Description                                                  | Change type |    PR     |
| :----------------------------------------------------------- | :---------: | :-------: |
| Added new variable to support AWS builds                     | **Feature** | [#2144][] |
| Added ability to use `.jsx` files                            | **Feature** | [#2128][] |
| Added an App Bar section to the styleguide                   | **Feature** | [#2119][] |
| Added Drawer Footer to styleguide                            | **Feature** | [#2093][] |
| Added a button section to the styleguide                     | **Feature** | [#2088][] |
| Added color section to styleguide                            | **Feature** | [#2030][] |
| Added typography section to styleguide                       | **Feature** | [#2013][] |
| Added venia-concept `dist` directory to the `npmignore` file | **Update**  | [#2225][] |
| Upgraded dependencies                                        | **Update**  | [#2098][] |
| Fixed broken summarizeEvents function                        | **Bugfix**  | [#2194][] |
| Fixed broken VSCode Jest Plugin                              | **Bugfix**  | [#2039][] |

## Upgrading from a previous version

The method for updating to 6.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
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

This method can be a chore, and we hope that some of the features in 5.0.0 will help these users migrate to a package management approach.

### NPM packages

Some users have imported the PWA Studio libraries using NPM.
This is the easiest way to work with the released versions of PWA Studio.

#### Upgrade method: Update `package.json`

To upgrade to 6.0.0, update the project's `package.json` file and change the dependency version for PWA Studio.

[pwa studio releases]: https://github.com/magento/pwa-studio/releases
[client side caching topic]: https://pwastudio.io/technologies/basic-concepts/client-side-caching/
[`venia-upward.yml`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-concept/venia-upward.yml
[hello upward]: https://pwastudio.io/tutorials/hello-upward/simple-server/
[magento compatibility table]: https://pwastudio.io/technologies/magento-compatibility/
[react hooks]: https://reactjs.org/docs/hooks-intro.html
[#2250]: https://github.com/magento/pwa-studio/pull/2250
[#2249]: https://github.com/magento/pwa-studio/pull/2249
[#2240]: https://github.com/magento/pwa-studio/pull/2240
[#2235]: https://github.com/magento/pwa-studio/pull/2235
[#2233]: https://github.com/magento/pwa-studio/pull/2233
[#2229]: https://github.com/magento/pwa-studio/pull/2229
[#2225]: https://github.com/magento/pwa-studio/pull/2225
[#2224]: https://github.com/magento/pwa-studio/pull/2224
[#2218]: https://github.com/magento/pwa-studio/pull/2218
[#2216]: https://github.com/magento/pwa-studio/pull/2216
[#2215]: https://github.com/magento/pwa-studio/pull/2215
[#2213]: https://github.com/magento/pwa-studio/pull/2213
[#2207]: https://github.com/magento/pwa-studio/pull/2207
[#2206]: https://github.com/magento/pwa-studio/pull/2206
[#2201]: https://github.com/magento/pwa-studio/pull/2201
[#2200]: https://github.com/magento/pwa-studio/pull/2200
[#2199]: https://github.com/magento/pwa-studio/pull/2199
[#2196]: https://github.com/magento/pwa-studio/pull/2196
[#2195]: https://github.com/magento/pwa-studio/pull/2195
[#2194]: https://github.com/magento/pwa-studio/pull/2194
[#2193]: https://github.com/magento/pwa-studio/pull/2193
[#2192]: https://github.com/magento/pwa-studio/pull/2192
[#2191]: https://github.com/magento/pwa-studio/pull/2191
[#2189]: https://github.com/magento/pwa-studio/pull/2189
[#2187]: https://github.com/magento/pwa-studio/pull/2187
[#2185]: https://github.com/magento/pwa-studio/pull/2185
[#2184]: https://github.com/magento/pwa-studio/pull/2184
[#2183]: https://github.com/magento/pwa-studio/pull/2183
[#2181]: https://github.com/magento/pwa-studio/pull/2181
[#2179]: https://github.com/magento/pwa-studio/pull/2179
[#2175]: https://github.com/magento/pwa-studio/pull/2175
[#2174]: https://github.com/magento/pwa-studio/pull/2174
[#2169]: https://github.com/magento/pwa-studio/pull/2169
[#2167]: https://github.com/magento/pwa-studio/pull/2167
[#2166]: https://github.com/magento/pwa-studio/pull/2166
[#2165]: https://github.com/magento/pwa-studio/pull/2165
[#2157]: https://github.com/magento/pwa-studio/pull/2157
[#2156]: https://github.com/magento/pwa-studio/pull/2156
[#2153]: https://github.com/magento/pwa-studio/pull/2153
[#2150]: https://github.com/magento/pwa-studio/pull/2150
[#2149]: https://github.com/magento/pwa-studio/pull/2149
[#2148]: https://github.com/magento/pwa-studio/pull/2148
[#2147]: https://github.com/magento/pwa-studio/pull/2147
[#2146]: https://github.com/magento/pwa-studio/pull/2146
[#2144]: https://github.com/magento/pwa-studio/pull/2144
[#2143]: https://github.com/magento/pwa-studio/pull/2143
[#2142]: https://github.com/magento/pwa-studio/pull/2142
[#2140]: https://github.com/magento/pwa-studio/pull/2140
[#2137]: https://github.com/magento/pwa-studio/pull/2137
[#2133]: https://github.com/magento/pwa-studio/pull/2133
[#2129]: https://github.com/magento/pwa-studio/pull/2129
[#2128]: https://github.com/magento/pwa-studio/pull/2128
[#2125]: https://github.com/magento/pwa-studio/pull/2125
[#2124]: https://github.com/magento/pwa-studio/pull/2124
[#2123]: https://github.com/magento/pwa-studio/pull/2123
[#2122]: https://github.com/magento/pwa-studio/pull/2122
[#2121]: https://github.com/magento/pwa-studio/pull/2121
[#2119]: https://github.com/magento/pwa-studio/pull/2119
[#2116]: https://github.com/magento/pwa-studio/pull/2116
[#2115]: https://github.com/magento/pwa-studio/pull/2115
[#2114]: https://github.com/magento/pwa-studio/pull/2114
[#2113]: https://github.com/magento/pwa-studio/pull/2113
[#2112]: https://github.com/magento/pwa-studio/pull/2112
[#2111]: https://github.com/magento/pwa-studio/pull/2111
[#2108]: https://github.com/magento/pwa-studio/pull/2108
[#2104]: https://github.com/magento/pwa-studio/pull/2104
[#2098]: https://github.com/magento/pwa-studio/pull/2098
[#2096]: https://github.com/magento/pwa-studio/pull/2096
[#2095]: https://github.com/magento/pwa-studio/pull/2095
[#2094]: https://github.com/magento/pwa-studio/pull/2094
[#2093]: https://github.com/magento/pwa-studio/pull/2093
[#2092]: https://github.com/magento/pwa-studio/pull/2092
[#2090]: https://github.com/magento/pwa-studio/pull/2090
[#2088]: https://github.com/magento/pwa-studio/pull/2088
[#2084]: https://github.com/magento/pwa-studio/pull/2084
[#2083]: https://github.com/magento/pwa-studio/pull/2083
[#2081]: https://github.com/magento/pwa-studio/pull/2081
[#2079]: https://github.com/magento/pwa-studio/pull/2079
[#2077]: https://github.com/magento/pwa-studio/pull/2077
[#2075]: https://github.com/magento/pwa-studio/pull/2075
[#2073]: https://github.com/magento/pwa-studio/pull/2073
[#2071]: https://github.com/magento/pwa-studio/pull/2071
[#2069]: https://github.com/magento/pwa-studio/pull/2069
[#2067]: https://github.com/magento/pwa-studio/pull/2067
[#2065]: https://github.com/magento/pwa-studio/pull/2065
[#2063]: https://github.com/magento/pwa-studio/pull/2063
[#2061]: https://github.com/magento/pwa-studio/pull/2061
[#2050]: https://github.com/magento/pwa-studio/pull/2050
[#2039]: https://github.com/magento/pwa-studio/pull/2039
[#2037]: https://github.com/magento/pwa-studio/pull/2037
[#2030]: https://github.com/magento/pwa-studio/pull/2030
[#2013]: https://github.com/magento/pwa-studio/pull/2013
[#2005]: https://github.com/magento/pwa-studio/pull/2005
[#2321]: https://github.com/magento/pwa-studio/pull/2321
[#2305]: https://github.com/magento/pwa-studio/pull/2305
[#2283]: https://github.com/magento/pwa-studio/pull/2283
