# Release 5.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 5.0.0 and above._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 5.0.0](#whats-new-in-500)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Updating from 4.0.0](#updating-from-400)
-   [Known issues](#known-issues)

## What's new in 5.0.0

PWA Studio 5.0.0 contains new features, refactors, breaking changes, and various improvements.

### Page Builder integration

[Page Builder](https://devdocs.magento.com/page-builder/docs/index.html) is a content creation tool developed by Magento.
It allows merchants to define store layouts using the Admin panel.

Page Builder integrating with PWA Studio means merchants may now use Page Builder to define the layout in the Magento backend and have that content rendered in a PWA Studio storefront.

This release makes the Venia `RichContent` component compatible with the default Page Builder content types.

### Scaffolding

Getting a new PWA Studio project up and running is now easier with the `@magento/create-pwa` command.
This command is a user-friendly version of the `create-project` sub-command in the `pwa-buildpack` CLI tool.

Use this command to set up an initial project structure using the Venia storefront as a template.
It provides an interactive questionnaire to help configure the different parts of your project.

For more information see: [Scaffolding][]

[Scaffolding]: https://pwastudio.io/pwa-buildpack/scaffolding/

### Talons

This release introduces the concept of Peregrine Talons.

Peregrine Talons are a set of React Hooks tailored for a specific UI component.
They contain logic for calculating the values rendered by its companion UI component.

Separating the logic and the presentational pieces of a component lets developers swap out either piece when creating custom UI components.

For more information see: [Peregrine Talons][]

[Peregrine Talons]: https://pwastudio.io/peregrine/talons/

### New route handler

Routing in the project has been updated to use the React Router library instead of a custom router.

The following is a summary of these changes:

- The new `Routes` component replaces `renderRoutes()`
- The new `MagentoRoute` component replaces `MagentoRouteHandler`
- The new `useMagentoRoute()` Talon replaces `MagentoRouteHandler`

### State management refactors

This release refactors the way PWA Studio handles state management in Venia.
Instead of using Redux directly, Peregrine now provides a set of context providers and Hooks to interact with the different slices of state in the global data store.

For more information, read [State management](https://pwastudio.io/technologies/basic-concepts/state-management/)

### REST to GraphQL migration

With the increase in GraphQL coverage in the latest Magento release (2.3.4), PWA Studio continues to refactor out REST usage in favor of GraphQL.

Various usage of REST have been converted to GraphQL.
These changes include the various cart interactions, sign-in/sign-out, and fetching country data.

For more information on GraphQL, see: [GraphQL Developer Guide][]

[graphql developer guide]: https://devdocs.magento.com/guides/v2.3/graphql/

### Performance improvements

A lot of work has been done in this release to improve the performance provided by PWA Studio tools and libraries.

#### Service worker improvements

Service worker changes in this release provides smarter use of the cache and when to invalidate stale data.
Other improvements include more optimized bundles/images and route handling.

#### Optimized images

Handling images on the storefront has been improved in this release.
Storefronts are now able to load the optimal image for a given viewport.

New features such as pre-fetching and lazy loading also boosts page load performance.

### Refactoring classes to functional components

This release refactors various classes into functional components.
This was done to align with the move towards using React Hooks throughout the project.

### Breadcrumbs

The breadcrumb feature has been added to Venia's product and category pages.
Use this feature to improve navigation in your storefronts.

### Potential breaking changes

Since this is a major release, some of the changes previously listed may break projects dependent on PWA Studio and its tools and components.

These changes include:

- Refactoring to produce Talons have modified the public API of some Venia components
- Converting from REST to GraphQL calls
- Optimizing images required updates that modify how images should be used
- Converting classes to functional components to use React Hooks
- Replacing `MagentoRouteHandler` with new component and Talon

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                                 | Change type  |    PR     |
| :------------------------------------------------------------------------------------------ | :----------: | :-------: |
| Added meta descriptions to root pages                                                       | **Feature**  | [#2035][] |
| Added email validation to ForgotPasswordForm                                                | **Feature**  | [#1997][] |
| Improved performance by lazy loading AuthModal                                              | **Feature**  | [#1955][] |
| Improved performance by lazy loading Category filters                                       | **Feature**  | [#1971][] |
| Improved Image fit with Fastly                                                              | **Feature**  | [#1976][] |
| Added product page breadcrumbs                                                              | **Feature**  | [#1960][] |
| Added category page breadcrumbs                                                             | **Feature**  | [#1949][] |
| Improved product page caching                                                               | **Feature**  | [#1935][] |
| Added PageBuilder components                                                                | **Feature**  | [#1872][] |
| Implemented the `apollo-link-retry` Link                                                    | **Feature**  | [#1799][] |
| Created component for showing categories with no products                                   | **Feature**  | [#1496][] |
| Updated template HTML to include noscript fallback                                          |  **Update**  | [#2034][] |
| Removed id from `getCustomer` response object                                               |  **Update**  | [#2028][] |
| Added Email validation in signin form                                                       |  **Update**  | [#1981][] |
| Added support for Carousel appearance for Product content type                              |  **Update**  | [#1951][] |
| Updated static to venia-static                                                              |  **Update**  | [#1932][] |
| Upgraded Apollo View layer to Hooks                                                         |  **Update**  | [#1827][] |
| Improved efficiency of the `getNavigationMenu` query                                        |  **Update**  | [#1867][] |
| Added field labels for inputs                                                               |  **Update**  | [#1845][] |
| Update mixin references to Talon                                                            |  **Update**  | [#1820][] |
| Deleted unused home component                                                               |  **Update**  | [#1798][] |
| Implemented route-based code splitting                                                      |  **Update**  | [#1765][] |
| Updated Swatch Treatments                                                                   |  **Update**  | [#1512][] |
| Added support for initial selections on the **Edit Item** screen                            |  **Update**  | [#1592][] |
| Replaced connected components with context Hooks                                            |  **Update**  | [#1664][] |
| Removed sticky attribute from the pagination                                                |  **Update**  | [#1735][] |
| Replaced `rem` to pixels in the `height` and `width` attribute for the pagination image     |  **Update**  | [#1738][] |
| Refactored checkout workflow to set shipping address/get shipping methods with GraphQL      | **Refactor** | [#2018][] |
| Refactored code to use `updateItem` mutations                                               | **Refactor** | [#2017][] |
| Refactored code to use GraphQL for adding items to cart                                     | **Refactor** | [#1987][] |
| Replaced REST endpoing for cart item removal with a `removeItemFromCart` mutation           | **Refactor** | [#2015][] |
| Refactor code to revoke customer token using GraphQL mutation on sign out                   | **Refactor** | [#2012][] |
| Refactor code to use GraphQL mutation to create/fetch cartId.                               | **Refactor** | [#1988][] |
| Removed `test.only` from test file                                                          | **Refactor** | [#1989][] |
| Refactor components to fetch Countries from GraphQL instead of REST                         | **Refactor** | [#1993][] |
| Replaced sign-in REST with GraphQL                                                          | **Refactor** | [#1904][] |
| Standardized GraphQL files with 4-space indentation                                         | **Refactor** | [#1914][] |
| Replaced the `create-account` REST endpoint with the `createCustomer` GraphQL mutation      | **Refactor** | [#1898][] |
| Removed `redux.compose()` where not needed                                                  | **Refactor** | [#1916][] |
| Refactored VeniaAdapter to improve initial page load                                        | **Refactor** | [#1816][] |
| Refactor Gallery component                                                                  | **Refactor** | [#1791][] |
| Fixed a bug that caused an incorrect default swatch image ratio on the product details page |  **Bugfix**  | [#2055][] |
| Fixed Search Result counts mismatch                                                         |  **Bugfix**  | [#2037][] |
| Fixed bug that incorrectly toggled the cart drawer inside the update item action            |  **Bugfix**  | [#2038][] |
| Fixed bug that caused an error when adding, editing, then saving a configurable item        |  **Bugfix**  | [#2040][] |
| Fixed Footer position bug which broke z-index styling on Edge                               |  **Bugfix**  | [#2014][] |
| Fixed storybook                                                                             |  **Bugfix**  | [#1945][] |
| Fixed invalud default initial value for checkout form                                       |  **Bugfix**  | [#1983][] |
| Fixed bug where Product price does not change when changing configurable options            |  **Bugfix**  | [#1964][] |
| Fixed bug that caused an incorrect number of products being loaded for product content type |  **Bugfix**  | [#1973][] |
| Fixed bug where data was being persisted on logout                                          |  **Bugfix**  | [#1962][] |
| Added ability to debounce search input                                                      |  **Bugfix**  | [#1952][] |
| Fixed Hook dependencies for app toast error handling                                        |  **Bugfix**  | [#1929][] |
| Fixed Button being exported twice                                                           |  **Bugfix**  | [#1912][] |
| Fixed regular expression                                                                    |  **Bugfix**  | [#1880][] |
| Fixed a bug that overwrote the animation-fill-mode                                          |  **Bugfix**  | [#1839][] |
| Fixed Talon import in pagination                                                            |  **Bugfix**  | [#1826][] |
| Fixed SearchBar lazy loading                                                                |  **Bugfix**  | [#1764][] |
| Removed back arrow for first level in main menu                                             |  **Bugfix**  | [#1337][] |
| Fixed a transparent background bug for `.png` images                                        |  **Bugfix**  | [#1690][] |

### Peregrine library

| Description                                                                                   | Change type  |    PR     |
| :-------------------------------------------------------------------------------------------- | :----------: | :-------: |
| Implemented Product Images pre-fetching                                                       | **Feature**  | [#1938][] |
| Created Search root component Talon                                                           | **Feature**  | [#1953][] |
| Add ability to lazy load images                                                               | **Feature**  | [#1871][] |
| Created `FilterModal` Talon                                                                   | **Feature**  | [#1884][] |
| Created `Product Options` Talons                                                              | **Feature**  | [#1819][] |
| Created `Footer` Talon                                                                        | **Feature**  | [#1860][] |
| Created `app` Talon                                                                           | **Feature**  | [#1828][] |
| Created `ProductFullDetail` Talon                                                             | **Feature**  | [#1814][] |
| Created `Navigation` Talon                                                                    | **Feature**  | [#1810][] |
| Created `ProductImagecarousel` and `Thumbnail` Talons                                         | **Feature**  | [#1817][] |
| Created `Pagination` Talon                                                                    | **Feature**  | [#1812][] |
| Created `CreateAccount` and `CreateAccountPage` Talons                                        | **Feature**  | [#1778][] |
| Created image Talons                                                                          | **Feature**  | [#1803][] |
| Created MiniCart Talons                                                                       | **Feature**  | [#1807][] |
| Created Forgot Password Talon                                                                 | **Feature**  | [#1788][] |
| Created `SearchBar` Talons                                                                    | **Feature**  | [#1786][] |
| Created `Checkout` Talons                                                                     | **Feature**  | [#1775][] |
| Created `useCategoryTree` Talon                                                               | **Feature**  | [#1754][] |
| Created `categoryTile`/`categoryList` Talon                                                   | **Feature**  | [#1755][] |
| Created `authBar` and `userChip` Talons                                                       | **Feature**  | [#1751][] |
| Created `authModal` Talon                                                                     | **Feature**  | [#1752][] |
| Created `signIn` mixin                                                                        | **Feature**  | [#1745][] |
| Created `myAccount` mixin                                                                     | **Feature**  | [#1727][] |
| Made pagination page buffer configurable                                                      |  **Update**  | [#2032][] |
| Improved Image API                                                                            |  **Update**  | [#1956][] |
| Renamed mixins to Talons                                                                      |  **Update**  | [#1757][] |
| Removed selector code                                                                         |  **Update**  | [#1703][] |
| Combined the checkoutReceipt actions/state/etc with the checkout state slice                  |  **Update**  | [#1686][] |
| Merged the directory state and actions into the checkout state slice                          |  **Update**  | [#1694][] |
| Refactored `getCartDetails` to GraphQL                                                        | **Refactor** | [#2029][] |
| Refactored `getUserDetails` to use GraphQL                                                    | **Refactor** | [#2004][] |
| Refactored code to eliminate use of MagentoRouteHandler                                       | **Refactor** | [#1966][] |
| Replaced `withRouter` with react router Hooks                                                 | **Refactor** | [#1937][] |
| Refactored code to use the opposite operator                                                  | **Refactor** | [#1851][] |
| Refactored header components and added Talons                                                 | **Refactor** | [#1793][] |
| Refactored Venia to extract modular components into Peregrine                                 | **Refactor** | [#1605][] |
| Fixed a Page Builder bug that affected alignment Inheritance for Button Group                 |  **Bugfix**  | [#2085][] |
| Fixed a Page Builder bug that appended `.html` to links redirected to CMS pages               |  **Bugfix**  | [#2054][] |
| Fixed a bug that made the Page Builder's product content type behavior inconsistent with Luma |  **Bugfix**  | [#2056][] |
| Fixed route cache bug                                                                         |  **Bugfix**  | [#1841][] |

### Build tools

| Description                                                     | Change type  |    PR     |
| :-------------------------------------------------------------- | :----------: | :-------: |
| Implemented robust HTML update checking using Node HTML Parser  | **Feature**  | [#2086][] |
| Optimized Webpack for Service Worker                            | **Feature**  | [#1992][] |
| Improved error handling for env and stage errors                | **Feature**  | [#1943][] |
| Implemented HTML caching and Service Worker communication API   | **Feature**  | [#1905][] |
| Added Image Optimizing Origin as an environment variable        | **Feature**  | [#1849][] |
| Added commit hash to generated bundles                          | **Feature**  | [#1881][] |
| Improved Service Worker HTML handling                           | **Feature**  | [#1874][] |
| Enabled client side caching                                     | **Feature**  | [#1806][] |
| Created scaffolding tools for new projects                      | **Feature**  | [#1500][] |
| Updated Braintree environment variable to be self documenting   |  **Update**  | [#2008][] |
| Updated the backend value in `create-pwa` package               |  **Update**  | [#1975][] |
| Removed duplicate code                                          |  **Update**  | [#1838][] |
| Improve buildpack test coverage                                 |  **Update**  | [#1598][] |
| Replaced the async webpack plugin                               |  **Update**  | [#1628][] |
| Refactored Service Worker and ServiceWorkerPlugin               | **Refactor** | [#1832][] |
| Removed unused parameters                                       | **Refactor** | [#1837][] |
| Restored working debug error page                               |  **Bugfix**  | [#2011][] |
| Fixed handling of service worker actions in Dev mode            |  **Bugfix**  | [#2002][] |
| Fixed hot reloading                                             |  **Bugfix**  | [#1972][] |
| Suppressed GraphQL Certificate Errors                           |  **Bugfix**  | [#1969][] |
| Fixed invalid `veniaResource` reference in `upward.js` comments |  **Bugfix**  | [#1910][] |
| Added a missing break statement                                 |  **Bugfix**  | [#1887][] |
| Resolved the heuristic fragment matcher warning                 |  **Bugfix**  | [#1707][] |
| Fixed a bug in the post-install script                          |  **Bugfix**  | [#1734][] |

### Documentation

| Description                                                                |    Change type    |    PR     |
| :------------------------------------------------------------------------- | :---------------: | :-------: |
| Created draft for first tutorial for PWA Studio Fundamentals               | **Documentation** | [#2022][] |
| Created draft for new tutorial series to help beginners                    | **Documentation** | [#2024][] |
| Created Tutorial to create storefront component                            | **Documentation** | [#1982][] |
| Created content rendering topic                                            | **Documentation** | [#2003][] |
| Published venia ui component docs                                          | **Documentation** | [#1946][] |
| Added JSDocs for Venia UI Components                                       | **Documentation** | [#1853][] |
| Created Peregrine Talons overview                                          | **Documentation** | [#1876][] |
| Created List components jsdocs                                             | **Documentation** | [#1795][] |
| Created Carousel component jsdocs                                          | **Documentation** | [#1794][] |
| Created state management doc                                               | **Documentation** | [#1785][] |
| Updated doc dependencies                                                   |    **Update**     | [#2033][] |
| Added MBI to search and updated site switcher                              |    **Update**     | [#2001][] |
| Updated `upward-spec` doc                                                  |    **Update**     | [#1977][] |
| Added site switcher to the header                                          |    **Update**     | [#1970][] |
| Updated devdocs dependencies                                               |    **Update**     | [#1957][] |
| Updated cloud deploy docs                                                  |    **Update**     | [#1926][] |
| Added instructions to circumvent self-signed ssl-certificate errors        |    **Update**     | [#1923][] |
| Fixed tools and library graphic                                            |    **Update**     | [#1889][] |
| Updated Venia setup doc                                                    |    **Update**     | [#1809][] |
| Updated README file                                                        |    **Update**     | [#1717][] |
| Update contribution guide                                                  |    **Update**     | [#1651][] |
| Refactored site content navigation                                         |   **Refactor**    | [#1933][] |
| Refactored doc scripts to remove unused imports and ignore some parameters |   **Refactor**    | [#1835][] |
| Fixed typo on cloud deployment topic                                       |    **Bugfix**     | [#2007][] |
| Fixed typo on cloud deployment topic                                       |    **Bugfix**     | [#1974][] |
| Removed duplicate words from sentences                                     |    **Bugfix**     | [#1893][] |
| Changed word to lowercase                                                  |    **Bugfix**     | [#1834][] |
| Fixed `pwa-devdocs` folder path                                            |    **Bugfix**     | [#1643][] |
| Fixed UPWARD yml path                                                      |    **Bugfix**     | [#1644][] |

### Misc

| Description                                                                  | Change type  |    PR     |
| :--------------------------------------------------------------------------- | :----------: | :-------: |
| Created initial content for a Venia styleguide                               | **Feature**  | [#1984][] |
| Improved Jest error detection and reporter output                            | **Feature**  | [#1948][] |
| Simplified image middleware with express-sharp update                        | **Feature**  | [#1830][] |
| Updated handlebars version from 4.1.2 to 4.5.3                               |  **Update**  | [#2048][] |
| Added typography section to styleguide                                       |  **Update**  | [#2013][] |
| Updated eslint dependency                                                    |  **Update**  | [#2000][] |
| Added tests for `registerImagePreFetchHandler` in service worker             |  **Update**  | [#1994][] |
| Added tests for Service Worker                                               |  **Update**  | [#1965][] |
| Added CODEOWNERS for Page Builder                                            |  **Update**  | [#1961][] |
| Updated `csv-parse` version from 4.3.4 to 4.4.6                              |  **Update**  | [#1896][] |
| Updated test URL for Jest tests                                              |  **Update**  | [#1836][] |
| Update dependency for `npm-run`                                              |  **Update**  | [#1674][] |
| Refactored Service Worker route handling                                     | **Refactor** | [#1859][] |
| Added `.gitignore` entries to the files comming from `@magento/pwa`          |  **Bugfix**  | [#1939][] |
| Fixed Prettier use                                                           |  **Bugfix**  | [#1941][] |
| Fixed compatibility of string compare                                        |  **Bugfix**  | [#1878][] |
| Fixed `npx bundlesize` path resolution issue                                 |  **Bugfix**  | [#1854][] |
| Fixed `react-feather` bundle                                                 |  **Bugfix**  | [#1852][] |
| Fixed a bug that prevented a dev server from running in a Docker environment |  **Bugfix**  | [#1558][] |

## Upgrading from a previous version

The method for updating to 5.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
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

To upgrade to 5.0.0, update the project's `package.json` file and change the dependency version for PWA Studio.

## Known issues

The following is a list of known issues for this release.

### Console error when clicking links

When Magento's Admin UI and PWA Studio storefront are open in the same browser, a console error is thrown.
This happens if your backend shares the same hostname as your storefront.
As a workaround, access the admin from a private browser session so the service worker does not affect requests to the storefront.

### Images not loading in development

If you set the `MAGENTO_BACKEND_URL` environment variable to the secure (https) base url of a local instance, or an instance with a known-bad SSL certificate, images will not load correctly.
As a workaround, manually set the `NODE_TLS_REJECT_UNAUTHORIZED` environment variable to `0` when running the development server.

[Pull Request #2005](https://github.com/magento/pwa-studio/pull/2005) addresses this issue and will be part of a future release.

### Magento 2.3.2 compatibility

The changes and features introduced in this release use GraphQL endpoints found only in Magento versions 2.3.3 and above.
If your Magento backend uses 2.3.2 and below, you will need additional development to make PWA Studio libraries compatible.

[pwa studio releases]: https://github.com/magento/pwa-studio/releases
[client side caching topic]: https://pwastudio.io/technologies/basic-concepts/client-side-caching/
[`venia-upward.yml`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-concept/venia-upward.yml
[hello upward]: https://pwastudio.io/tutorials/hello-upward/simple-server/
[magento compatibility table]: https://pwastudio.io/technologies/magento-compatibility/
[react hooks]: https://reactjs.org/docs/hooks-intro.html

[#1598]: https://github.com/magento/pwa-studio/pull/1598
[#1337]: https://github.com/magento/pwa-studio/pull/1337
[#1643]: https://github.com/magento/pwa-studio/pull/1643
[#1644]: https://github.com/magento/pwa-studio/pull/1644
[#1674]: https://github.com/magento/pwa-studio/pull/1674
[#1605]: https://github.com/magento/pwa-studio/pull/1605
[#1686]: https://github.com/magento/pwa-studio/pull/1686
[#1694]: https://github.com/magento/pwa-studio/pull/1694
[#1628]: https://github.com/magento/pwa-studio/pull/1628
[#1690]: https://github.com/magento/pwa-studio/pull/1690
[#1558]: https://github.com/magento/pwa-studio/pull/1558
[#1664]: https://github.com/magento/pwa-studio/pull/1664
[#1703]: https://github.com/magento/pwa-studio/pull/1703
[#1651]: https://github.com/magento/pwa-studio/pull/1651
[#1592]: https://github.com/magento/pwa-studio/pull/1592
[#1734]: https://github.com/magento/pwa-studio/pull/1734
[#1735]: https://github.com/magento/pwa-studio/pull/1735
[#1738]: https://github.com/magento/pwa-studio/pull/1738
[#1717]: https://github.com/magento/pwa-studio/pull/1717
[#1512]: https://github.com/magento/pwa-studio/pull/1512
[#1727]: https://github.com/magento/pwa-studio/pull/1727
[#1745]: https://github.com/magento/pwa-studio/pull/1745
[#1757]: https://github.com/magento/pwa-studio/pull/1757
[#1752]: https://github.com/magento/pwa-studio/pull/1752
[#1500]: https://github.com/magento/pwa-studio/pull/1500
[#1751]: https://github.com/magento/pwa-studio/pull/1751
[#1755]: https://github.com/magento/pwa-studio/pull/1755
[#1764]: https://github.com/magento/pwa-studio/pull/1764
[#1691]: https://github.com/magento/pwa-studio/pull/1691
[#1801]: https://github.com/magento/pwa-studio/pull/1801
[#1785]: https://github.com/magento/pwa-studio/pull/1785
[#1791]: https://github.com/magento/pwa-studio/pull/1791
[#1765]: https://github.com/magento/pwa-studio/pull/1765
[#1794]: https://github.com/magento/pwa-studio/pull/1794
[#1754]: https://github.com/magento/pwa-studio/pull/1754
[#1798]: https://github.com/magento/pwa-studio/pull/1798
[#1793]: https://github.com/magento/pwa-studio/pull/1793
[#1809]: https://github.com/magento/pwa-studio/pull/1809
[#1775]: https://github.com/magento/pwa-studio/pull/1775
[#1786]: https://github.com/magento/pwa-studio/pull/1786
[#1788]: https://github.com/magento/pwa-studio/pull/1788
[#1795]: https://github.com/magento/pwa-studio/pull/1795
[#1807]: https://github.com/magento/pwa-studio/pull/1807
[#1803]: https://github.com/magento/pwa-studio/pull/1803
[#1778]: https://github.com/magento/pwa-studio/pull/1778
[#1812]: https://github.com/magento/pwa-studio/pull/1812
[#1806]: https://github.com/magento/pwa-studio/pull/1806
[#1817]: https://github.com/magento/pwa-studio/pull/1817
[#1810]: https://github.com/magento/pwa-studio/pull/1810
[#1820]: https://github.com/magento/pwa-studio/pull/1820
[#1826]: https://github.com/magento/pwa-studio/pull/1826
[#1496]: https://github.com/magento/pwa-studio/pull/1496
[#1816]: https://github.com/magento/pwa-studio/pull/1816
[#1834]: https://github.com/magento/pwa-studio/pull/1834
[#1838]: https://github.com/magento/pwa-studio/pull/1838
[#1836]: https://github.com/magento/pwa-studio/pull/1836
[#1839]: https://github.com/magento/pwa-studio/pull/1839
[#1837]: https://github.com/magento/pwa-studio/pull/1837
[#1835]: https://github.com/magento/pwa-studio/pull/1835
[#1845]: https://github.com/magento/pwa-studio/pull/1845
[#1852]: https://github.com/magento/pwa-studio/pull/1852
[#1680]: https://github.com/magento/pwa-studio/pull/1680
[#1851]: https://github.com/magento/pwa-studio/pull/1851
[#1854]: https://github.com/magento/pwa-studio/pull/1854
[#1799]: https://github.com/magento/pwa-studio/pull/1799
[#1841]: https://github.com/magento/pwa-studio/pull/1841
[#1707]: https://github.com/magento/pwa-studio/pull/1707
[#1814]: https://github.com/magento/pwa-studio/pull/1814
[#1867]: https://github.com/magento/pwa-studio/pull/1867
[#1869]: https://github.com/magento/pwa-studio/pull/1869
[#1832]: https://github.com/magento/pwa-studio/pull/1832
[#1828]: https://github.com/magento/pwa-studio/pull/1828
[#1827]: https://github.com/magento/pwa-studio/pull/1827
[#1830]: https://github.com/magento/pwa-studio/pull/1830
[#1876]: https://github.com/magento/pwa-studio/pull/1876
[#1880]: https://github.com/magento/pwa-studio/pull/1880
[#1860]: https://github.com/magento/pwa-studio/pull/1860
[#1878]: https://github.com/magento/pwa-studio/pull/1878
[#1887]: https://github.com/magento/pwa-studio/pull/1887
[#1853]: https://github.com/magento/pwa-studio/pull/1853
[#1889]: https://github.com/magento/pwa-studio/pull/1889
[#1859]: https://github.com/magento/pwa-studio/pull/1859
[#1819]: https://github.com/magento/pwa-studio/pull/1819
[#1896]: https://github.com/magento/pwa-studio/pull/1896
[#1872]: https://github.com/magento/pwa-studio/pull/1872
[#1893]: https://github.com/magento/pwa-studio/pull/1893
[#1923]: https://github.com/magento/pwa-studio/pull/1923
[#1874]: https://github.com/magento/pwa-studio/pull/1874
[#1910]: https://github.com/magento/pwa-studio/pull/1910
[#1881]: https://github.com/magento/pwa-studio/pull/1881
[#1926]: https://github.com/magento/pwa-studio/pull/1926
[#1916]: https://github.com/magento/pwa-studio/pull/1916
[#1912]: https://github.com/magento/pwa-studio/pull/1912
[#1898]: https://github.com/magento/pwa-studio/pull/1898
[#1914]: https://github.com/magento/pwa-studio/pull/1914
[#1929]: https://github.com/magento/pwa-studio/pull/1929
[#1932]: https://github.com/magento/pwa-studio/pull/1932
[#1904]: https://github.com/magento/pwa-studio/pull/1904
[#1849]: https://github.com/magento/pwa-studio/pull/1849
[#1884]: https://github.com/magento/pwa-studio/pull/1884
[#1946]: https://github.com/magento/pwa-studio/pull/1946
[#1941]: https://github.com/magento/pwa-studio/pull/1941
[#1933]: https://github.com/magento/pwa-studio/pull/1933
[#1937]: https://github.com/magento/pwa-studio/pull/1937
[#1905]: https://github.com/magento/pwa-studio/pull/1905
[#1939]: https://github.com/magento/pwa-studio/pull/1939
[#1952]: https://github.com/magento/pwa-studio/pull/1952
[#1948]: https://github.com/magento/pwa-studio/pull/1948
[#1871]: https://github.com/magento/pwa-studio/pull/1871
[#1953]: https://github.com/magento/pwa-studio/pull/1953
[#1957]: https://github.com/magento/pwa-studio/pull/1957
[#1962]: https://github.com/magento/pwa-studio/pull/1962
[#1943]: https://github.com/magento/pwa-studio/pull/1943
[#1951]: https://github.com/magento/pwa-studio/pull/1951
[#1961]: https://github.com/magento/pwa-studio/pull/1961
[#1956]: https://github.com/magento/pwa-studio/pull/1956
[#1935]: https://github.com/magento/pwa-studio/pull/1935
[#1949]: https://github.com/magento/pwa-studio/pull/1949
[#1969]: https://github.com/magento/pwa-studio/pull/1969
[#1965]: https://github.com/magento/pwa-studio/pull/1965
[#1966]: https://github.com/magento/pwa-studio/pull/1966
[#1973]: https://github.com/magento/pwa-studio/pull/1973
[#1975]: https://github.com/magento/pwa-studio/pull/1975
[#1960]: https://github.com/magento/pwa-studio/pull/1960
[#1970]: https://github.com/magento/pwa-studio/pull/1970
[#1974]: https://github.com/magento/pwa-studio/pull/1974
[#1976]: https://github.com/magento/pwa-studio/pull/1976
[#1972]: https://github.com/magento/pwa-studio/pull/1972
[#1964]: https://github.com/magento/pwa-studio/pull/1964
[#1971]: https://github.com/magento/pwa-studio/pull/1971
[#1938]: https://github.com/magento/pwa-studio/pull/1938
[#1981]: https://github.com/magento/pwa-studio/pull/1981
[#1984]: https://github.com/magento/pwa-studio/pull/1984
[#1994]: https://github.com/magento/pwa-studio/pull/1994
[#1993]: https://github.com/magento/pwa-studio/pull/1993
[#1992]: https://github.com/magento/pwa-studio/pull/1992
[#2002]: https://github.com/magento/pwa-studio/pull/2002
[#1977]: https://github.com/magento/pwa-studio/pull/1977
[#1989]: https://github.com/magento/pwa-studio/pull/1989
[#2003]: https://github.com/magento/pwa-studio/pull/2003
[#1982]: https://github.com/magento/pwa-studio/pull/1982
[#2004]: https://github.com/magento/pwa-studio/pull/2004
[#2001]: https://github.com/magento/pwa-studio/pull/2001
[#2007]: https://github.com/magento/pwa-studio/pull/2007
[#1983]: https://github.com/magento/pwa-studio/pull/1983
[#1988]: https://github.com/magento/pwa-studio/pull/1988
[#2000]: https://github.com/magento/pwa-studio/pull/2000
[#1945]: https://github.com/magento/pwa-studio/pull/1945
[#2014]: https://github.com/magento/pwa-studio/pull/2014
[#2012]: https://github.com/magento/pwa-studio/pull/2012
[#2008]: https://github.com/magento/pwa-studio/pull/2008
[#1955]: https://github.com/magento/pwa-studio/pull/1955
[#2015]: https://github.com/magento/pwa-studio/pull/2015
[#1997]: https://github.com/magento/pwa-studio/pull/1997
[#1987]: https://github.com/magento/pwa-studio/pull/1987
[#2011]: https://github.com/magento/pwa-studio/pull/2011
[#2017]: https://github.com/magento/pwa-studio/pull/2017
[#2028]: https://github.com/magento/pwa-studio/pull/2028
[#2022]: https://github.com/magento/pwa-studio/pull/2022
[#2024]: https://github.com/magento/pwa-studio/pull/2024
[#2033]: https://github.com/magento/pwa-studio/pull/2033
[#2032]: https://github.com/magento/pwa-studio/pull/2032
[#2029]: https://github.com/magento/pwa-studio/pull/2029
[#2034]: https://github.com/magento/pwa-studio/pull/2034
[#2035]: https://github.com/magento/pwa-studio/pull/2035
[#2018]: https://github.com/magento/pwa-studio/pull/2018
[#2040]: https://github.com/magento/pwa-studio/pull/2040
[#2038]: https://github.com/magento/pwa-studio/pull/2038
[#2013]: https://github.com/magento/pwa-studio/pull/2013
[#2048]: https://github.com/magento/pwa-studio/pull/2048
[#2037]: https://github.com/magento/pwa-studio/pull/2037
[#2086]: https://github.com/magento/pwa-studio/pull/2086
[#2056]: https://github.com/magento/pwa-studio/pull/2056
[#2054]: https://github.com/magento/pwa-studio/pull/2054
[#2085]: https://github.com/magento/pwa-studio/pull/2085
[#2055]: https://github.com/magento/pwa-studio/pull/2055
