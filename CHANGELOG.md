# Release 12.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.0.0._
_For older release notes, see [PWA Studio releases][]._

## New Features

-  [Added **Shimmer loading component** to improve page loading](#added-shimmer-loading-component)
-  [Prepared PWA Studio for **Themeing with Tailwind CSS**](#prepared-pwa-studio-for-theming-with-tailwind-css)
-  [Added **Add to Cart** button for products displayed on category pages](#added-add-to-cart-from-product-category-pages)
-  [Added new **route-authentication handling**](#added-new-route-authentication-handling)
-  [Improved **Lighthouse scores**](#improved-lighthouse-scores)

### Add To Cart from product category pages

Shoppers can now add products to their cart directly from the product category pages, without going to the product detail page. Each product listed on the category page now has an **Add to Cart** button. If the product is out of stock, we either hide the button or disable the button and change its text to **Out of Stock**.

#### Pull Requests

| Jira Issue      | Description                                                     | PR       |
|-----------------|-----------------------------------------------------------------|----------|
| <!--PWA-1843--> | Add to Cart on Category Listing - Out of stock are not visible. | [3272][] |
| <!--PWA-1845--> | Add to Cart on Category Listing - Out of stock is visible.      | [3356][] |
| <!--PWA-1847--> | Add to Cart on Search Results - Out of stock is visible.        | [3361][] |
| <!--PWA-1850--> | Add to Cart on CMS - Out of stock is visible.                   | [3433][] |

### Added Shimmer loader component

<!--PWA-1865-->
The `Shimmer` component is a loading indicator that takes the shape of the component being loaded. This gives users an idea of what content will be on the page before it's fully loaded, which improves the perceived loading performance and eliminates layout shift.
This loading improvement is most notable on product listing and product detail pages.

#### Pull Requests

| Jira Issue      | Description                                                       | PR       |
|-----------------|-------------------------------------------------------------------|----------|
| <!--PWA-1908--> | Improve loading perception while navigating between pages         | [3308][] |
| <!--PWA-1204--> | UPWARD PHP inlining and Shimmer enhancements                      | [3353][] |
| <!--PWA-1204--> | Improved Loading Experience - Shimmer and Inlining                | [3428][] |
| <!--PWA-1906--> | PoC: Pre-fetching and Inlining with Upward Connector Module (PHP) | [3353][] |
| <!--PWA-2166--> | Slider movement causing Cypress test failures                     | [3436][] |
| <!--PWA-1976--> | Customizing shimmer loader                                        | [3353][] |

### Prepared PWA Studio for Themeing with Tailwind CSS

In preparation for our full theming implementation in the next release, we have added the [Tailwind CSS framework][] and updated our CSS infrastructure to support a wider variety of custom theming approaches. Significant changes in this release include:

[tailwind css framework]: https://tailwindcss.com/

| Jira Issue      | Description                                                                                                                                                                                           | PR       |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| <!--PWA-1880--> | Added Tailwind to PWA Studio for Theme configuration.                                                                                                                                                 | [3341][] |
| <!--PWA-1963--> | Created a Tailwind theme package in the monorepo.                                                                                                                                                     | [3400][] |
| <!--PWA-2102--> | Fixed `PostCSS` console errors and warnings during `yarn build`.                                                                                                                                      | [3394][] |
| <!--PWA-2117--> | Renamed our existing CSS files to match the standard CSS Module pattern: `*.module.css`. This limits the scope of CSS Modules to prevent it from reprocessing Tailwind CSS and your own `.css` files. | [3414][] |

### Added new route-authentication handling

Guest users (users not signed-in to the site) are now redirected to a new `/sign-in` page when trying to access pages that require authentication, such as the `/order-history` page. To support the new routing authentication, we created several new components:

-  `AuthRoute` — New component that returns the `Route` or a `Redirect` to the `sign-in` page if the user is not signed-in.
-  `SignInPage` — New component that returns a page with a sign-in form where users can sign-in to their existing account, create a new account, or reset their password.
-  `ForgotPasswordPage` — New page that shows a form to reset user's password.
-  `CreateAccountPage` — Updated to work with the new route-authentication handling.

| Jira Issue     | Description                   | PR       |
|----------------|-------------------------------|----------|
| <!--PWA-845--> | Route authentication handling | [3406][] |

### Improved Lighthouse scores

Google Lighthouse scores are now `100` for Best Practices, Accessibility, and SEO categories. Average scores for the Performance category have also improved.<!--PWA-1977-->

#### Pull Requests

| Jira Issue      | Description                                                                          | PR       |
|-----------------|--------------------------------------------------------------------------------------|----------|
| <!--PWA-1798--> | Avoid an excessive DOM size from duplication of navigation                           | [3388][] |
| <!--PWA-1204--> | Improved loading experience for PLP and PDP page types                               | [3353][] |
| <!--PWA-2077--> | Page Builder Slider Keyboard nav improved                                            | [3420][] |
| <!--PWA-1934--> | Page Builder Banner and Slider content types load without layout shifts on the page. | [3328][] |
| <!--PWA-2071--> | Markup updates to improve SEO and Accessibility                                      | [3412][] |
| <!--PWA-2070--> | Tap Targets size and Color Contrast                                                  | [3421][] |
| <!--PWA-2074--> | Image placeholders updates to improve the Best Practices score                       | [3411][] |
| <!--PWA-2075--> | Meta information for Category Meta Descriptions                                      | [3471][] |

## Updates

| Jira Issue      | Description                                                                                                                             | PR               |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------|------------------|
| <!--PWA-555-->  | Migrated `magento-commerce/upward-php` from Zend to Laminas.                                                                            | [upward-php/3][] |
| <!--PWA-912-->  | Updated the service worker to cache more than just URLs with `.html` suffixes.                                                          | [3448][]         |
| <!--PWA-922-->  | Updated the Venia splash image shown when JavaScript is disabled in the browser.                                                        | [3355][]         |
| <!--PWA-983-->  | Moved all project `CartPage/.../*.gql.js` files from `venia-ui` to the `peregrine/talons` directory.                                    | [3457][]         |
| <!--PWA-984-->  | Moved all project `CheckoutPage/.../*.gql.js` files from `venia-ui` to the `peregrine/talons` directory.                                | [3441][]         |
| <!--PWA-1244--> | Refactor all queries that use category or product `url_suffix` to use the `storeConfig` suffix.                                         | [3393][]         |
| <!--PWA-1278--> | Added keyboard accessiblity to the `MegaMenu` component. Users can now navigate through all the MegaMenu links with their keyboards.    | [3319][]         |
| <!--PWA-1702--> | Enabled trusted extension vendors to change code outside their namespace, namely within `@magento/[packages]`.                          | [3266][]         |
| <!--PWA-1790--> | Enabled Page Builder `Row` appearances (Full Width, Full Bleed) to work as expected on the Venia storefront.                            | [3221][]         |
| <!--PWA-1868--> | Implemented new GraphQL caching header that Venia and other storefronts must send to GraphQL.                                           | [3278][]         |
| <!--PWA-1909--> | Updated CSS Module source maps to make CSS `className` easy to find and change during development.                                      | [3407][]         |
| <!--PWA-1928--> | Added extensibility point (new target) for new Page Builder content types: `setContentTypeConfig`                                       | [3307][]         |
| <!--PWA-1933--> | Added two new status to Order History page: `received` (order submitted but not processed) and `rejected` (failure when placing order). | [3431][]         |
| <!--PWA-1964--> | Updated Workbox packages to version `6.2.4` to fix the backwards compatibility issue we had with our previous version `6.0.2`.          | [3378][]         |

## Bug fixes

| Jira Issue      | Description                                                                                                                                                                         | PR       |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| <!--PWA-882-->  | Fixed direct GraphQL errors displayed on Venia forms. Replaced with helpful, user-focused errors.                                                                                   | [3281][] |
| <!--PWA-2187--> | Fixed a checkout error that occurred when Braintree was enabled. Added missing import statement to `BraintreeSummary` component.                                                    | [3470][] |
| <!--PWA-892-->  | Fixed form issue with Region/State fields not clearing after user changes the Country field from US to UK or UK to US.                                                              | [3364][] |
| <!--PWA-1029--> | Fixed Home page styling on scaffolded apps.                                                                                                                                         | [3391][] |
| <!--PWA-1198--> | Fixed an issue where editing items in the cart could remove the item after clicking the Update button.                                                                              | [3279][] |
| <!--PWA-1636--> | Fixed issue where small images used in the `Carousel` component could expand into the description area.                                                                             | [3398][] |
| <!--PWA-1686--> | Fixed the `useFieldState` hook in the `TextInput` and `QuantityFields` components to prevent false console warnings. The hook checked their states before the fields rendered.      | [3399][] |
| <!--PWA-1712--> | Fixed the region/state codes on billing forms (for countries like France) to display names instead of numbers.                                                                      | [3335][] |
| <!--GH #3185--> | Fixed the `ProductImageCarousel` to no longer duplicate thumbnails of the product's default variant.                                                                                | [3186][] |
| <!--PWA-1798--> | Fixed the Lighthouse warning: `Avoid an excessive DOM size`. This warning appeared after the implementation of [#3115](https://github.com/magento/pwa-studio/issues/3115).          | [3388][] |
| <!--PWA-1871--> | Fixed the WishList Edit dialog to remove errors that remained after closing and reopening the dialog.                                                                               | [3405][] |
| <!--PWA-1930--> | Fixed the `ErrorView` component from throwing console warnings on pages with missing translations.                                                                                  | [3236][] |
| <!--PWA-1944--> | Fixed URL Rewrite to work properly for Venia.                                                                                                                                       | [3309][] |
| <!--PWA-1968--> | Fixed Page Builder products from showing "Out of Stock" message for products that are in stock.                                                                                     | [3336][] |
| <!--PWA-1974--> | Fixed the Known Issue from v11.0.0 in which the URL for a suggested category contained two store codes (/default/default/) instead of one, creating a 404 error when selected.      | [3344][] |
| <!--PWA-1979--> | Fixed dependency warnings displayed when scaffolding a new PWA app with `yarn create @magento/pwa`.                                                                                 | [3380][] |
| <!--PWA-1985--> | Fixed CSS `background-repeat` property issue on Safari.                                                                                                                             | [3348][] |
| <!--PWA-1998--> | Fixed alignment of "Add to Favorites" icon on product category pages.                                                                                                               | [3351][] |
| <!--PWA-2073--> | Fixed Page Builder product descriptions (Mobile only) from rendering with the wrong HTML tags. All descriptions now use the correct component: `RichContent` instead of `RichText`. | [3409][] |
| <!--PWA-2143--> | Fixed image caching issue where the `maxEntries` setting on service workers was ignored. This caused the site to slow as the image cache grew with 100s of entries.                 | [3452][] |
| <!--PWA-2149--> | Fixed error in `SubmenuColumn` component that occurred when a sub-category had no children (sub-catagories of its own).                                                             | [3427][] |
| <!--PWA-2177--> | Fixed the `InjectManifest` build error that occurred when running (`yarn run build`) on scaffolded apps.                                                                            | [3454][] |
| <!--PWA-2233--> | Fixed an Apollo cache issue in which checkout data was not cleared from cache if users switched store views before checkout.                                                        | [3482][] |

## Documentation Updates

| Jira Issue      | Description                                                                                                   | PR       |
|-----------------|---------------------------------------------------------------------------------------------------------------|----------|
| <!--PWA-2179--> | Added table to show which Adobe Commerce and Magento Open Source features PWA Studio supporst out of the box. | [3459][] |
| <!--PWA-2014--> | Added additional guidelines for overriding Adapter.                                                           | [3395][] |
| <!--PWA-1077--> | Updated wrappable talons documenation.                                                                        | [3243][] |
| <!--PWA-1929--> | Fixed example in TargetableReactComponent page.                                                               | [3259][] |
| <!--PWA-2128--> | Completed migration to AdobeIO PWA Docs site.                                                                 | [3480][] |
| <!--PWA-2179--> | Added Commerce feature support table that PWA Studio provides out-of-the-box.                                 | [3459][] |
| <!--PWA-1925--> | Added a solution to a possible error during SASS loader installation.                                         | [3269][] |
| <!--PWA-2195--> | Updated Magento capability table.                                                                             | [3467][] |
| <!--PWA-1924--> | Fixed grammar in the Internationalization topic.                                                              | [3274][] |

## Breaking Changes

| Jira Issue      | Description                                                                                                                                                                                                           | PR       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| <!--PWA-1588--> | Removed `Enzyme` and `@wojtekmaj/enzyme-adapter-react-17` packages. Update any tests that use the `Enzyme` or `@wojtekmaj/enzyme-adapter-react-17` packages.                                                          | [3393][] |
| <!--PWA-1704--> | Changed the UPWARD configuration to prevent a race condition that could prevent `yarn build` command from emmitting images. Overriden static asset configurations now only take the overriden value, instead of both. | [3410][] |
| <!--PWA-1704--> | Hundreds of CSS files have been renamed and their components updated to point to the new filenames.                                                                                                                   | [3414][] |

## Known Issues

Scaffolding projects using `npm` version 7 or above (`npm init @magento/pwa`) results in errors. While we investigate, you can use one of the following workarounds:

1. Use `yarn` instead: `yarn create @magento/pwa`.
2. When installing the scaffolded project, use the --legacy-peer-deps flag to force `npm` to treat peer dependencies as it did in versions 4-6.

## Test Updates

| Jira Issue      | Description                                                                                                       | PR                     |
|-----------------|-------------------------------------------------------------------------------------------------------------------|------------------------|
| <!--PWA-949-->  | New jest tests for Filters components.                                                                            | [3372][]               |
| <!--PWA-2100--> | Extensibility — Trusted vendors can now modify dependency sources.                                                | [3362][]               |
| <!--PWA-2015--> | Fixed product snaps after icon adjustment.                                                                        | [3362][]               |
| <!--PWA-2144--> | Fixed local URL support for running Cypress tests with Docker.                                                    | [3422][]               |
| <!--PWA-1480--> | New code build test that runs the `create-pwa` scaffolding app for PRs.                                           | [pwa-studio-cicd/79][] |
| <!--PWA-1546--> | New Cypress test to verify that Page Builder content types render and function correctly in the Venia storefront. | [3315][]               |
| <!--PWA-1539--> | New Cypress test for Page Builder Map.                                                                            | [3346][]               |
| <!--PWA-1541--> | New Cypress test for Page Builder Dynamic Block.                                                                  | [3326][]               |
| <!--PWA-1543--> | New Cypress test for Page Builder Divider.                                                                        | [3313][]               |
| <!--PWA-1544--> | New Cypress test for Page Builder Products.                                                                       | [3331][]               |
| <!--PWA-1547--> | New Cypress test for Page Builder Text.                                                                           | [3321][]               |
| <!--PWA-1550--> | New Cypress test for Page Builder Video.                                                                          | [3349][]               |
| <!--PWA-1551--> | New Cypress test for Page Builder Slider.                                                                         | [3310][]               |
| <!--PWA-1553--> | New Cypress test for Page Builder Block.                                                                          | [3317][]               |
| <!--PWA-1554--> | New Cypress test for Page Builder Column.                                                                         | [3326][]               |
| <!--PWA-1555--> | New Cypress test for Page Builder Row.                                                                            | [3333][]               |
| <!--PWA-1556--> | New Cypress test for Page Builder Tabs.                                                                           | [3324][]               |
| <!--PWA-1580--> | MFTF Fix tests because of Mega Menu UI updates (Automate Mega menu)                                               | [pwa-tests/10][]       |
| <!--PWA-1975--> | Added Cypress tests to our CICD pipeline so that they will run on GitHub with every PR.                           | [pwa-studio-cicd/87][] |
| <!--PWA-1914--> | Updated Cypress tests to wait for network responses without relying on explicit waits.                            | [3343][]               |
| <!--PWA-1801--> | Updated Cypress single and multiple WishList tests.                                                               | [3257][]               |

## Repo Maintenance Tasks

| Jira Issue      | Description                                                                     | PR       |
|-----------------|---------------------------------------------------------------------------------|----------|
| <!--PWA-1718--> | Updated `pwa-studio` repo dependencies to clear various GitHub security alerts. | [3318][] |
| <!--PWA-1889--> | Updated PR template.                                                            | [3280][] |
| <!--PWA-1987--> | Fix CICD Scaffolding job.                                                       | [3318][] |
| <!--PWA-2209--> | Update Community Contributor statistics.                                        | [3489][] |

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 11.0.0 to 12.0.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://magento.github.io/pwa-studio/tutorials/pwa-studio-fundamentals/project-setup/
[upgrading versions]: https://magento.github.io/pwa-studio/technologies/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.0.0.
Versions that are in **bold** indicate a version change for this release.

**Note:**
Your project may not depend on some of the packages listed on this table.

| Package                         | Latest version |
|---------------------------------|----------------|
| `babel-preset-peregrine`        | 1.1.0          |
| `create-pwa`                    | **2.0.0**      |
| `upward-security-headers`       | 1.0.4          |
| `venia-adobe-data-layer`        | 1.0.1          |
| `venia-sample-backends`         | 0.0.4          |
| `venia-sample-language-packs`   | 0.0.4          |
| `venia-sample-payments-checkmo` | 0.0.2          |
| `pagebuilder`                   | **7.0.0**      |
| `peregrine`                     | **12.0.0**     |
| `pwa-buildpack`                 | 10.0.0         |
| `upward-js`                     | **5.2.0**      |
| `upward-spec`                   | **5.1.0**      |
| `venia-concept`                 | **12.0.0**     |
| `venia-ui`                      | **9.0.0**      |
| `magento2-upward-connector`     | **1.3.0**      |
| `upward-php`                    | **1.2.0**      |

### Update template files

The following template files contain updates in 12.0.0:

- [src/.storybook/config.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/.storybook/config.js)
- [src/index.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/index.js)
- [src/ServiceWorker/registerRoutes.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/ServiceWorker/registerRoutes.js)
- [src/ServiceWorker/setupWorkbox.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/ServiceWorker/setupWorkbox.js)
- [src/ServiceWorker/Utilities/ImageCacheHandler.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/ServiceWorker/Utilities/ImageCacheHandler.js)
- [.graphqlconfig](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/.grpahqlconfig)
- [package.json](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/package.json)
- [template.html](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/template.html)
- [webpack.config.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/webpack.config.js)

If you did not make any modifications to these files, you can copy and paste the new content over your old template files in your project.
If you made modifications to these files in your project, you will have to manually apply the changes by using `git diff` on the PWA Studio repository or by using a [diff tool][].

[diff tool]: https://marketplace.visualstudio.com/search?term=diff&target=VSCode&category=All%20categories&sortBy=Relevance

### New template files

The following template files have been added in 12.0.0:

- [src/index.css](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/src/index.css)
- [postcss.config.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/postcss.config.js)
- [tailwind.config.js](https://github.com/magento/pwa-studio/blob/v12.0.0/packages/venia-concept/tailwind.config.js)

Add these files to your project as part of your project upgrade to 12.0.0.


[pwa studio releases]: https://github.com/magento/pwa-studio/releases

[upward-php/3]: https://github.com/magento-commerce/upward-php/pull/3
[pwa-studio-cicd/79]: https://github.com/magento-commerce/pwa-studio-cicd/pull/79
[pwa-tests/10]: https://github.com/magento-commerce/pwa-tests/pull/10
[pwa-studio-cicd/87]: https://github.com/magento-commerce/pwa-studio-cicd/pull/87

[3257]: https://github.com/magento/pwa-studio/pull/3257
[3489]: https://github.com/magento/pwa-studio/pull/3489
[3280]: https://github.com/magento/pwa-studio/pull/3280
[3269]: https://github.com/magento/pwa-studio/pull/3269
[3259]: https://github.com/magento/pwa-studio/pull/3259
[3243]: https://github.com/magento/pwa-studio/pull/3243
[3278]: https://github.com/magento/pwa-studio/pull/3278
[3221]: https://github.com/magento/pwa-studio/pull/3211
[3274]: https://github.com/magento/pwa-studio/pull/3274
[3482]: https://github.com/magento/pwa-studio/pull/3482
[3236]: https://github.com/magento/pwa-studio/pull/3236
[3413]: https://github.com/magento/pwa-studio/pull/3413
[3415]: https://github.com/magento/pwa-studio/pull/3415
[3416]: https://github.com/magento/pwa-studio/pull/3416
[3408]: https://github.com/magento/pwa-studio/pull/3408
[3402]: https://github.com/magento/pwa-studio/pull/3402
[3403]: https://github.com/magento/pwa-studio/pull/3403
[3404]: https://github.com/magento/pwa-studio/pull/3404
[3186]: https://github.com/magento/pwa-studio/pull/3186
[3279]: https://github.com/magento/pwa-studio/pull/3279
[3398]: https://github.com/magento/pwa-studio/pull/3398
[3284]: https://github.com/magento/pwa-studio/pull/3284
[3329]: https://github.com/magento/pwa-studio/pull/3329
[3332]: https://github.com/magento/pwa-studio/pull/3332
[3323]: https://github.com/magento/pwa-studio/pull/3323
[3309]: https://github.com/magento/pwa-studio/pull/3309
[3321]: https://github.com/magento/pwa-studio/pull/3321
[3326]: https://github.com/magento/pwa-studio/pull/3326
[3312]: https://github.com/magento/pwa-studio/pull/3312
[3281]: https://github.com/magento/pwa-studio/pull/3281
[3272]: https://github.com/magento/pwa-studio/pull/3272
[3313]: https://github.com/magento/pwa-studio/pull/3313
[3317]: https://github.com/magento/pwa-studio/pull/3317
[3282]: https://github.com/magento/pwa-studio/pull/3282
[3325]: https://github.com/magento/pwa-studio/pull/3325
[3315]: https://github.com/magento/pwa-studio/pull/3315
[3331]: https://github.com/magento/pwa-studio/pull/3331
[3346]: https://github.com/magento/pwa-studio/pull/3346
[3335]: https://github.com/magento/pwa-studio/pull/3335
[3333]: https://github.com/magento/pwa-studio/pull/3333
[3351]: https://github.com/magento/pwa-studio/pull/3351
[3310]: https://github.com/magento/pwa-studio/pull/3310
[3364]: https://github.com/magento/pwa-studio/pull/3364
[3374]: https://github.com/magento/pwa-studio/pull/3374
[3373]: https://github.com/magento/pwa-studio/pull/3373
[3361]: https://github.com/magento/pwa-studio/pull/3361
[3341]: https://github.com/magento/pwa-studio/pull/3341
[3378]: https://github.com/magento/pwa-studio/pull/3378
[3363]: https://github.com/magento/pwa-studio/pull/3363
[3354]: https://github.com/magento/pwa-studio/pull/3354
[3307]: https://github.com/magento/pwa-studio/pull/3307
[3355]: https://github.com/magento/pwa-studio/pull/3355
[3362]: https://github.com/magento/pwa-studio/pull/3362
[3372]: https://github.com/magento/pwa-studio/pull/3372
[3344]: https://github.com/magento/pwa-studio/pull/3344
[3324]: https://github.com/magento/pwa-studio/pull/3324
[3336]: https://github.com/magento/pwa-studio/pull/3336
[3338]: https://github.com/magento/pwa-studio/pull/3338
[3398]: https://github.com/magento/pwa-studio/pull/3398
[3343]: https://github.com/magento/pwa-studio/pull/3343
[3340]: https://github.com/magento/pwa-studio/pull/3340
[3349]: https://github.com/magento/pwa-studio/pull/3349
[3266]: https://github.com/magento/pwa-studio/pull/3266
[3400]: https://github.com/magento/pwa-studio/pull/3400
[3319]: https://github.com/magento/pwa-studio/pull/3319
[3380]: https://github.com/magento/pwa-studio/pull/3380
[3395]: https://github.com/magento/pwa-studio/pull/3395
[3407]: https://github.com/magento/pwa-studio/pull/3407
[3356]: https://github.com/magento/pwa-studio/pull/3356
[3401]: https://github.com/magento/pwa-studio/pull/3401
[3393]: https://github.com/magento/pwa-studio/pull/3393
[3328]: https://github.com/magento/pwa-studio/pull/3328
[3397]: https://github.com/magento/pwa-studio/pull/3397
[3405]: https://github.com/magento/pwa-studio/pull/3405
[3427]: https://github.com/magento/pwa-studio/pull/3427
[3409]: https://github.com/magento/pwa-studio/pull/3409
[3353]: https://github.com/magento/pwa-studio/pull/3353
[3308]: https://github.com/magento/pwa-studio/pull/3308
[3406]: https://github.com/magento/pwa-studio/pull/3406
[3420]: https://github.com/magento/pwa-studio/pull/3420
[3399]: https://github.com/magento/pwa-studio/pull/3399
[3391]: https://github.com/magento/pwa-studio/pull/3391
[3394]: https://github.com/magento/pwa-studio/pull/3394
[3411]: https://github.com/magento/pwa-studio/pull/3411
[3428]: https://github.com/magento/pwa-studio/pull/3428
[3348]: https://github.com/magento/pwa-studio/pull/3348
[3422]: https://github.com/magento/pwa-studio/pull/3422
[3388]: https://github.com/magento/pwa-studio/pull/3388
[3431]: https://github.com/magento/pwa-studio/pull/3431
[3410]: https://github.com/magento/pwa-studio/pull/3410
[3448]: https://github.com/magento/pwa-studio/pull/3448
[3414]: https://github.com/magento/pwa-studio/pull/3414
[3436]: https://github.com/magento/pwa-studio/pull/3436
[3450]: https://github.com/magento/pwa-studio/pull/3450
[3433]: https://github.com/magento/pwa-studio/pull/3433
[3382]: https://github.com/magento/pwa-studio/pull/3382
[3262]: https://github.com/magento/pwa-studio/pull/3262
[3454]: https://github.com/magento/pwa-studio/pull/3454
[3459]: https://github.com/magento/pwa-studio/pull/3459
[3441]: https://github.com/magento/pwa-studio/pull/3441
[3412]: https://github.com/magento/pwa-studio/pull/3412
[3452]: https://github.com/magento/pwa-studio/pull/3452
[3421]: https://github.com/magento/pwa-studio/pull/3421
[3457]: https://github.com/magento/pwa-studio/pull/3457
[3467]: https://github.com/magento/pwa-studio/pull/3467
[3470]: https://github.com/magento/pwa-studio/pull/3470
[3318]: https://github.com/magento/pwa-studio/pull/3318
[3463]: https://github.com/magento/pwa-studio/pull/3463
[3471]: https://github.com/magento/pwa-studio/pull/3471
[3474]: https://github.com/magento/pwa-studio/pull/3474
[3464]: https://github.com/magento/pwa-studio/pull/3464
[3478]: https://github.com/magento/pwa-studio/pull/3478
[3480]: https://github.com/magento/pwa-studio/pull/3480