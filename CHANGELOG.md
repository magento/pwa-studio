# Release 6.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 6.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 6.0.0](#whats-new-in-600)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 6.0.0

## Pull requests merged in this release

| Description                                                                                              |    Change type    |     PR    |
| :------------------------------------------------------------------------------------------------------- | :---------------: | :-------: |
| \[PWA-335] Ensure apollo cache is updated after mutations/queries                                        |       **-**       | [#2250][] |
| \[Doc] add static route tutorial                                                                         |       **-**       | [#2249][] |
| Remove Mutation PII while still updating the Cache correctly                                             |       **-**       | [#2240][] |
| \[PWA-428] Update upward-connector PWA install docs                                                      |       **-**       | [#2235][] |
| Added firefox specific css.                                                                              |       **-**       | [#2233][] |
| Updating a SH code to work with ctrl+c/ctrl+v                                                            |       **-**       | [#2229][] |
| Add venia-concept dist to npmignore                                                                      |       **-**       | [#2225][] |
| ISSUE-2223: Fixed the bug with breadcrumbs on PDP with a product without categories                      |     **Bugfix**    | [#2224][] |
| \[Doc] Update contribution guide                                                                         |       **-**       | [#2218][] |
| \[PWA-388] Billing Information form does not have email validation as in shipping information form.      |       **-**       | [#2216][] |
| \[feature]: Disable cart mutations while others are in flight                                            |    **Feature**    | [#2215][] |
| SW PDP error fix for IMAGE_OPTIMIZING_ORIGIN=backend                                                     |     **Bugfix**    | [#2213][] |
| \[PWA-386] \[Firefox]. Qty field/steppers UI is not proper on Cart page.                                 |       **-**       | [#2207][] |
| \[bugfix]: Coupon code with leading/trailing whitespace works                                            |     **Bugfix**    | [#2206][] |
| \[Owls] PB-375: Align video background with embedded video                                               |       **-**       | [#2201][] |
| Fix conditionals in JSX                                                                                  |     **Bugfix**    | [#2200][] |
| \[Owls] PB-422: Extensions utilizing Page Builder as their content creation tool will break with upgrade |       **-**       | [#2199][] |
| Shows Error on invalid Product Quantity                                                                  |       **-**       | [#2196][] |
| \[Docs] update devdocs dependencies and build script                                                     | **Documentation** | [#2195][] |
| \[bug]: Fix broken summarizeEvents function                                                              |     **Bugfix**    | [#2194][] |
| \[PWA-370] Handling isFastNetwork.                                                                       |       **-**       | [#2193][] |
| \[Doc] update setup topic                                                                                |       **-**       | [#2192][] |
| \[PWA-272] \[Feature]: "Edit Item" From Cart Page Kebab Menu                                             |    **Feature**    | [#2191][] |
| Fixes Cart page sign out error when cart does not exist in cache                                         |     **Bugfix**    | [#2189][] |
| \[Owls] PB-376: Video Background on PWA Studio (Venia) Storefront                                        |       **-**       | [#2187][] |
| \[Doc] Update changelog for 5.0.1                                                                        |       **-**       | [#2185][] |
| Merge master to develop                                                                                  |       **-**       | [#2184][] |
| \[Doc] fix reference doc generator                                                                       |     **Bugfix**    | [#2183][] |
| \[PWA-181] Venia checkout skeleton                                                                       |       **-**       | [#2181][] |
| \[Docs] Revise and publish PWA Studio fundamentals intro and project setup                               | **Documentation** | [#2179][] |
| \[bugfix]: Do not cache create customer or sign in mutation data                                         |     **Bugfix**    | [#2176][] |
| Requires and trims gift card input                                                                       |       **-**       | [#2175][] |
| feat: interception targets for env vars                                                                  |       **-**       | [#2174][] |
| Fix RootComponentsPlugin to be IE compatible                                                             |     **Bugfix**    | [#2169][] |
| \[PWA-376] Cart page items show correct configurable options                                             |       **-**       | [#2167][] |
| \[feature]: Connect Filtering to GraphQL!                                                                |    **Feature**    | [#2166][] |
| \[bugfix]: search trigger focus                                                                          |     **Bugfix**    | [#2165][] |
| Images Appear                                                                                            |       **-**       | [#2164][] |
| PWA-213: \[UNIT TEST] Email Validation on Signin, Create Acount, Forgot Password                         |       **-**       | [#2157][] |
| Applied Gift Cards show current balance                                                                  |       **-**       | [#2156][] |
| FIX Docs - Add missing  variable                                                                         |       **-**       | [#2153][] |
| \[bugfix] Hide stale suggestions                                                                         |     **Bugfix**    | [#2150][] |
| Hide Accordion closed Sections instead of unmounting them                                                |       **-**       | [#2149][] |
| Changing defaults and docs for DEV_SERVER_SERVICE_WORKER_ENABLED.                                        |       **-**       | [#2148][] |
| Keeps current Accordion sections open                                                                    |       **-**       | [#2147][] |
| \[Owls] PB-55: Row Full Width Contents Are Horizontally Positioned Incorrectly In Desktop Viewport       |       **-**       | [#2146][] |
| Added new variable to support AWS builds                                                                 |       **-**       | [#2144][] |
| \[PWA-324] \[bug]: venia-static files don't load out-of-the box with scaffolding command                 |     **Bugfix**    | [#2143][] |
| \[#2141] Fix wrong PriceSummaryQuery export                                                              |     **Bugfix**    | [#2142][] |
| \[JIRA-340] Rendering cart page title.                                                                   |       **-**       | [#2140][] |
| \[PWA-334] Implement PageBuilder as an extension                                                         |       **-**       | [#2137][] |
| Add new categorySort Element #360                                                                        |       **-**       | [#2133][] |
| \[bug] Fix w10 issues                                                                                    |     **Bugfix**    | [#2129][] |
| Fix/add jsx loading                                                                                      |     **Bugfix**    | [#2128][] |
| \[docs] updating contribution guidelines to make explicit the need to sign Adobe's CLA                   | **Documentation** | [#2125][] |
| Gift Cards                                                                                               |       **-**       | [#2124][] |
| \[PWA-239] Shipping Method (Cart)                                                                        |       **-**       | [#2123][] |
| Merge \`master\` back to \`develop\`                                                                     |       **-**       | [#2122][] |
| \[SPIKE] \[PWA-339] Conditionally bundle CE or EE features in Venia.                                     |    **Feature**    | [#2121][] |
| Styleguide: App bar                                                                                      |       **-**       | [#2119][] |
| Refactoring for ErrorView #1308                                                                          |    **Refactor**   | [#2116][] |
| PWA-119: add product quantity stepper to cart                                                            |       **-**       | [#2115][] |
| \[PWA-178] Gift options support in cart page                                                             |       **-**       | [#2114][] |
| \[feature] intermediate breadcrumbs                                                                      |    **Feature**    | [#2113][] |
| bugfix: do not render things when no items are in cart                                                   |     **Bugfix**    | [#2112][] |
| \[Doc] Move pagebuilder docs out of drafts                                                               |       **-**       | [#2111][] |
| \[feature]: Cart Coupons                                                                                 |    **Feature**    | [#2108][] |
| Adjust cart styling                                                                                      |       **-**       | [#2104][] |
| Upgrade dependencies                                                                                     |       **-**       | [#2098][] |
| Move 5.0 docs out of drafts                                                                              |       **-**       | [#2096][] |
| \[chore] Initial attempt at fixing validator for venia-ui                                                |     **Bugfix**    | [#2095][] |
| \[Cart v2] ProductListing Component                                                                      |       **-**       | [#2094][] |
| \[PWA-156] Added Drawer Footer Styleguide.                                                               |       **-**       | [#2093][] |
| \[PWA-240] \[feature]: Cart Price Summary                                                                |    **Feature**    | [#2092][] |
| Adds PriceAdjustments and Accordion components                                                           |       **-**       | [#2090][] |
| Add a button section to the styleguide                                                                   |       **-**       | [#2088][] |
| Venia v2 Cart Page                                                                                       |       **-**       | [#2084][] |
| updates to updates-to-into-project-setup                                                                 |       **-**       | [#2083][] |
| Added preparing-to-go-live  tutorial doc                                                                 |       **-**       | [#2081][] |
| Added manage-state-with-redux tutorial doc                                                               |       **-**       | [#2079][] |
| Added use-magentos-graphql-api tutorial doc                                                              |       **-**       | [#2077][] |
| Added explore-graphql tutorial doc                                                                       |       **-**       | [#2075][] |
| Added reuse-a-venia-component tutorial doc                                                               |       **-**       | [#2073][] |
| Added component-state tutorial doc                                                                       |       **-**       | [#2071][] |
| Added css-modules tutorial doc                                                                           |       **-**       | [#2069][] |
| Added props-proptypes tutorial doc                                                                       |       **-**       | [#2067][] |
| Added update-site-footer tutorial doc                                                                    |       **-**       | [#2065][] |
| Added add-a-static-route  tutorial doc                                                                   |       **-**       | [#2063][] |
| added project-structure-and-routing tutorial doc                                                         |       **-**       | [#2061][] |
| Fixed binary file reading                                                                                |     **Bugfix**    | [#2050][] |
| Bump handlebars from 4.1.2 to 4.5.3                                                                      |       **-**       | [#2048][] |
| \[bugfix] Pass query to remove action                                                                    |     **Bugfix**    | [#2040][] |
| \[PWA-229] \[DX] VSCode Jest Plugin Broken                                                               |       **-**       | [#2039][] |
| \[bugfix] After adding product to cart toggle the cart drawer                                            |     **Bugfix**    | [#2038][] |
| Search Result Counts Match                                                                               |       **-**       | [#2037][] |
| \[bugfix]: Adds meta descriptions to root pages                                                          |     **Bugfix**    | [#2035][] |
| Add color section to styleguide                                                                          |       **-**       | [#2030][] |
| Refactor checkout workflow to set shipping address/get shipping methods with graphql                     |    **Refactor**   | [#2018][] |
| Add typography section to styleguide                                                                     |       **-**       | [#2013][] |
| refactor: 5x faster streaming image opto with no SSL failures                                            |    **Refactor**   | [#2005][] |

### Venia (storefront and visual component library)

### Peregrine library

### Build tools

### Documentation

### Misc

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
[#2176]: https://github.com/magento/pwa-studio/pull/2176
[#2175]: https://github.com/magento/pwa-studio/pull/2175
[#2174]: https://github.com/magento/pwa-studio/pull/2174
[#2169]: https://github.com/magento/pwa-studio/pull/2169
[#2167]: https://github.com/magento/pwa-studio/pull/2167
[#2166]: https://github.com/magento/pwa-studio/pull/2166
[#2165]: https://github.com/magento/pwa-studio/pull/2165
[#2164]: https://github.com/magento/pwa-studio/pull/2164
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
[#2048]: https://github.com/magento/pwa-studio/pull/2048
[#2040]: https://github.com/magento/pwa-studio/pull/2040
[#2039]: https://github.com/magento/pwa-studio/pull/2039
[#2038]: https://github.com/magento/pwa-studio/pull/2038
[#2037]: https://github.com/magento/pwa-studio/pull/2037
[#2035]: https://github.com/magento/pwa-studio/pull/2035
[#2030]: https://github.com/magento/pwa-studio/pull/2030
[#2018]: https://github.com/magento/pwa-studio/pull/2018
[#2013]: https://github.com/magento/pwa-studio/pull/2013
[#2005]: https://github.com/magento/pwa-studio/pull/2005
