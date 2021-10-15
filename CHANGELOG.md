# Release 12.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 11.0.0._
_For older release notes, see [PWA Studio releases][]._

## Feature Highlights

-   [Added **Add to Cart button** for products displayed on category pages](#added-add-to-cart-from-product-category-pages)
-   [Added **Shimmer loading component** to improve page loading](#added-shimmer-loading-component)
-   [Improved **Lighthouse scores**](#improved-lighthouse-scores)

## Add To Cart from product category pages

Shoppers can now add products to their cart directly from the product category pages, without going to the product detail page. Each product listed on the category page now has an **Add to Cart** button. And if the product is out of stock, the button disables itself and changes its text to **Out of Stock**.

### Pull Requests

| Description                                                                    | PR        |
|--------------------------------------------------------------------------------|-----------|
| <!--PWA-1843--> Add to Cart on Category Listing - Out of stock are not visible | [#3272][] |
| <!--PWA-1845--> Add to Cart on Category Listing - Out of stock is visible      | [#3356][] |
| <!--PWA-1847--> Add to Cart on Search Results - Out of stock is visible        | [#3361][] |
| <!--PWA-1850--> Add to Cart on CMS - Out of stock is visible                   | [#3433][] |

## Added Shimmer loader component

The `Shimmer` component is a loading indicator that takes the shape of the component being loaded. This gives users an idea of what content will be on the page before it's fully loaded, which improves the perceived loading performance and eliminates layout shift.
This is loading improvements are most notable on product listing and product detail pages.

### Pull Requests

| Description                                               | PR        |
|-----------------------------------------------------------|-----------|
| Improve loading perception while navigating between pages | [#3308][] |
| UPWARD PHP inlining and Shimmer enhancements              | [#3353][] |
| Improved Loading Experience - Shimmer and Inlining        | [#3428][] |
| PoC: Banner and Slider Optimizations                      | [#3328][] |

## Improved Lighthouse scores

Google Lighthouse performance for **Best Practices**, **Accessibility**, and **SEO** categories all score 100. Average scores for the Performance category have also improved. Specific metrics for Performance will be detailed at the time of release.

### Pull Requests

| Description                                                | PR        |
|------------------------------------------------------------|-----------|
| Change image placeholder to svg for Lighthouse improvement | [#3411][] |
| Lighthouse - Block focus of non active slick slides        | [#3420][] |

TODO: Get lighthouse scores for the Performance category.

## New features



## Perfomance improvements


## Bug fixes

The following bugs have been fixed in 12.0.0.

| Description                                                                                                        | PR        |
|--------------------------------------------------------------------------------------------------------------------|-----------|
| <!--PWA-882--> User-friendly Form Errors                                                                           | [#3281][] |
| <!--PWA-2187--> Fix missing import statement on BraintreeSummary                                                   | [#3470][] |
| <!--PWA-892--> Fix region input value not resetting after country change                                           | [#3364][] |
| <!--PWA-1029--> HomePage unstyled in scaffolded app                                                                | [#3391][] |
| <!--PWA-1198--> Resetting option in edit cart panel and clicking on update button removes product from art.        | [#3279][] |
| <!--PWA-1636--> Fixing display of smaller images in product carousel                                               | [#3398][] |
| <!--PWA-1686--> Fixed quantity field warning.                                                                      | [#3399][] |
| <!--PWA-1712--> Fixed region/state code displaying as a number instead of a name.                                  | [#3335][] |
| <!--Issue #3185--> Duplicate React component key props produced when selecting variants in product detail carousel | [#3186][] |
| <!--PWA-1798--> Avoid an excessive DOM size from duplication of navigation                                         | [#3388][] |
| <!--PWA-1871--> Errors clear after closing Wishlist Edit Dialog                                                    | [#3405][] |
| <!--PWA-1930--> Update en_US Translation for ErrorView                                                             | [#3236][] |
| <!--PWA-1944--> URL Rewrite is not working properly on Venia PWA                                                   | [#3309][] |
| <!--PWA-1968--> Page Builder Out of Stock messaging displaying for products that are in stock                      | [#3336][] |
| <!--PWA-1974--> Category Search Double Store Code                                                                  | [#3344][] |
| <!--PWA-1979--> Numerous warnings during set-up                                                                    | [#3380][] |
| <!--PWA-1985--> Background repeat not working on safari                                                            | [#3348][] |
| <!--PWA-1998--> Fixed alignment of Add to Favorites icon on category pages                                         | [#3351][] |
| <!--PWA-2014--> Update Adapter docs                                                                                | [#3395][] |
| <!--PWA-2015--> Update product snaps after icon adjustment                                                         | [#3362][] |
| <!--PWA-2073--> Product description rendering via RichText instead of RichContent                                  | [#3409][] |
| <!--PWA-2143--> Using ignoreVary config to support maxEntries                                                      | [#3452][] |
| <!--PWA-2144--> Cypress + Docker is not working on local instance URLs                                             | [#3422][] |
| <!--PWA-2149--> Submenu item error from keyboard props and GraphQL exception                                       | [#3427][] |
| <!--PWA-2177--> Error in scaffold build job                                                                        | [#3454][] |
| <!--PWA-2187--> Fixed Braintree Checkout broken. import statement on BraintreeSummary was missing.                 | [#3470][] |
| <!--PWA-2233--> Checkout data not being cleared from cache upon logout                                             | [#3482][] |

## Documentation changes



## Known issues

We are aware of an issue with scaffolding projects using `npm init @magento/pwa` using npm 7 and above. While we investigate, you can use one of the following workarounds:

1. Use yarn instead: `yarn create @magento/pwa`.
2. When installing the scaffolded project, use the --legacy-peer-deps flag to force NPM to treat peer dependencies as it did in versions 4-6.

## Hightlights

<!--PWA-1865--> Shimmer Effect Placeholder with PageType Prefetching
| <!--PWA-1977--> SEO and Best Practices Optimization for Lighthouse Score

## Stories
| <!--PWA-555--> Migrate from Zend to Laminas
| <!--PWA-845--> Handling Authorized Routes
| <!--PWA-912--> SW should be able to handle the new configured URL suffix.
| <!--PWA-922--> Update "Venia Closed" splash image
| <!--PWA-962--> Investigate Apollo v3 cache eviction APIs
| <!--PWA-983--> [CartPage] Migrate gql related files and folders to peregrine
| <!--PWA-984--> [CheckoutPage] Migrate gql related files and folders to peregrine
| <!--PWA-1077--> [Doc] Update wrappable talons doc
| <!--PWA-1204--> Improved loading experience for PLP and PDP page types
| <!--PWA-1244--> One source of truth for url suffix
| <!--PWA-1278--> a11y for mega menu
| <!--PWA-1480--> Test coverage: Install and run scaffolded PWA from NPM package
| <!--PWA-1539--> Verify Map
| <!--PWA-1541--> Verify Dynamic Block
| <!--PWA-1543--> Verify Divider
| <!--PWA-1544--> Verify Products
| <!--PWA-1546--> Smoke Test Content
| <!--PWA-1547--> Verify Text
| <!--PWA-1550--> Verify Video
| <!--PWA-1551--> Verify Slider
| <!--PWA-1553--> Verify Block
| <!--PWA-1554--> Verify Column
| <!--PWA-1555--> Verify Row
| <!--PWA-1556--> Verify Tabs
| <!--PWA-1580--> MFTF Fix tests because of Mega Menu UI updates (Automate Mega menu)
| <!--PWA-1588--> Remove Enzyme
| <!--PWA-1702--> Add the possibility to allow certain packages to change code outside their namespace
| <!--PWA-1704--> UPWARD race condition
| <!--PWA-1790--> Enable Page Builder Row Appearances (Full Width, Full Bleed) to work as expected
| <!--PWA-1868--> Implement new GraphQL caching header
| <!--PWA-1880--> Add Tailwind to PWA Studio
| <!--PWA-1906--> PoC: Pre-fetching and Inlining with Upward Connector Module (PHP)
| <!--PWA-1908--> [Proof of Concept] Improve loading when navigating between pages
| <!--PWA-1909--> [FEATURE] Improve className format during development
| <!--PWA-1914--> Waiting for button actions to complete mutations.
| <!--PWA-1919--> Banner loads with no layout shift on the page
| <!--PWA-1920--> Slider loads with no layout shift on the page
| <!--PWA-1924--> Adds grammar fixes to the Internationalization page
| <!--PWA-1925--> magento/pwa-devdocs#: Adds a solution to a possible error during SASS loader installation
| <!--PWA-1928--> Extensibility point (new target) to Pagebuilder setContentTypeConfig
| <!--PWA-1929--> [Docs]: Fixes example in TargetableReactComponent page
| <!--PWA-1933--> Order History page can render with new statuses
| <!--PWA-1934--> PoC: Banner and Slider Optimizations
| <!--PWA-1963--> Create a theme package in the monorepo
| <!--PWA-1964--> Update Workbox
| <!--PWA-1975--> Cypress CICD Job
| <!--PWA-1976--> Customizing shimmer loader
| <!--PWA-2070--> Tap Targets size and Color Contrast
| <!--PWA-2071--> Markup updates to improve SEO and Accessibility
| <!--PWA-2074--> Image placeholders updates to improve the Best Practices score
| <!--PWA-2075--> Meta information for Category Meta Descriptions
| <!--PWA-2077--> Page Builder Slider Keyboard nav improved
| <!--PWA-2102--> Fix PostCSS build noise
| <!--PWA-2117--> Rename CSS files for Tailwind
| <!--PWA-2128--> [Docs] Complete migration to AdobeIO PWA Docs site
| <!--PWA-2166--> Slider movement causing Cypress test failures
| <!--PWA-2179--> [Docs] Commerce feature support
| <!--PWA-2195--> Update magento capability table

## Tests

[PWA-2100--> Extensibility] Trusted vendors can modify dependency source

## Tasks

| <!--PWA-949--> Add jest tests for Filters Components.
| <!--PWA-1718--> Clear GitHub Security Alerts, Document Process
| <!--PWA-1801--> Update cypress single and multiple wishlist tests
| <!--PWA-1889--> Update PR Template
| <!--PWA-1987--> Fix CICD Scaffolding job
| <!--PWA-2209--> Update Community Contributor statistics


[pwa studio releases]: https://github.com/magento/pwa-studio/releases

[#3482]: https://github.com/magento/pwa-studio/pull/3482
[#3236]: https://github.com/magento/pwa-studio/pull/3236
[#3413]: https://github.com/magento/pwa-studio/pull/3413
[#3415]: https://github.com/magento/pwa-studio/pull/3415
[#3416]: https://github.com/magento/pwa-studio/pull/3416
[#3408]: https://github.com/magento/pwa-studio/pull/3408
[#3402]: https://github.com/magento/pwa-studio/pull/3402
[#3403]: https://github.com/magento/pwa-studio/pull/3403
[#3404]: https://github.com/magento/pwa-studio/pull/3404
[#3186]: https://github.com/magento/pwa-studio/pull/3186
[#3279]: https://github.com/magento/pwa-studio/pull/3279
[#3398]: https://github.com/magento/pwa-studio/pull/3398
[#3284]: https://github.com/magento/pwa-studio/pull/3284
[#3329]: https://github.com/magento/pwa-studio/pull/3329
[#3332]: https://github.com/magento/pwa-studio/pull/3332
[#3323]: https://github.com/magento/pwa-studio/pull/3323
[#3309]: https://github.com/magento/pwa-studio/pull/3309
[#3321]: https://github.com/magento/pwa-studio/pull/3321
[#3326]: https://github.com/magento/pwa-studio/pull/3326
[#3312]: https://github.com/magento/pwa-studio/pull/3312
[#3281]: https://github.com/magento/pwa-studio/pull/3281
[#3272]: https://github.com/magento/pwa-studio/pull/3272
[#3313]: https://github.com/magento/pwa-studio/pull/3313
[#3317]: https://github.com/magento/pwa-studio/pull/3317
[#3282]: https://github.com/magento/pwa-studio/pull/3282
[#3325]: https://github.com/magento/pwa-studio/pull/3325
[#3315]: https://github.com/magento/pwa-studio/pull/3315
[#3331]: https://github.com/magento/pwa-studio/pull/3331
[#3346]: https://github.com/magento/pwa-studio/pull/3346
[#3335]: https://github.com/magento/pwa-studio/pull/3335
[#3333]: https://github.com/magento/pwa-studio/pull/3333
[#3351]: https://github.com/magento/pwa-studio/pull/3351
[#3310]: https://github.com/magento/pwa-studio/pull/3310
[#3364]: https://github.com/magento/pwa-studio/pull/3364
[#3374]: https://github.com/magento/pwa-studio/pull/3374
[#3373]: https://github.com/magento/pwa-studio/pull/3373
[#3361]: https://github.com/magento/pwa-studio/pull/3361
[#3341]: https://github.com/magento/pwa-studio/pull/3341
[#3378]: https://github.com/magento/pwa-studio/pull/3378
[#3363]: https://github.com/magento/pwa-studio/pull/3363
[#3354]: https://github.com/magento/pwa-studio/pull/3354
[#3307]: https://github.com/magento/pwa-studio/pull/3307
[#3355]: https://github.com/magento/pwa-studio/pull/3355
[#3362]: https://github.com/magento/pwa-studio/pull/3362
[#3372]: https://github.com/magento/pwa-studio/pull/3372
[#3344]: https://github.com/magento/pwa-studio/pull/3344
[#3324]: https://github.com/magento/pwa-studio/pull/3324
[#3336]: https://github.com/magento/pwa-studio/pull/3336
[#3338]: https://github.com/magento/pwa-studio/pull/3338
[#3398]: https://github.com/magento/pwa-studio/pull/3398
[#3343]: https://github.com/magento/pwa-studio/pull/3343
[#3340]: https://github.com/magento/pwa-studio/pull/3340
[#3349]: https://github.com/magento/pwa-studio/pull/3349
[#3266]: https://github.com/magento/pwa-studio/pull/3266
[#3400]: https://github.com/magento/pwa-studio/pull/3400
[#3319]: https://github.com/magento/pwa-studio/pull/3319
[#3380]: https://github.com/magento/pwa-studio/pull/3380
[#3395]: https://github.com/magento/pwa-studio/pull/3395
[#3407]: https://github.com/magento/pwa-studio/pull/3407
[#3356]: https://github.com/magento/pwa-studio/pull/3356
[#3401]: https://github.com/magento/pwa-studio/pull/3401
[#3393]: https://github.com/magento/pwa-studio/pull/3393
[#3328]: https://github.com/magento/pwa-studio/pull/3328
[#3397]: https://github.com/magento/pwa-studio/pull/3397
[#3405]: https://github.com/magento/pwa-studio/pull/3405
[#3427]: https://github.com/magento/pwa-studio/pull/3427
[#3409]: https://github.com/magento/pwa-studio/pull/3409
[#3353]: https://github.com/magento/pwa-studio/pull/3353
[#3308]: https://github.com/magento/pwa-studio/pull/3308
[#3406]: https://github.com/magento/pwa-studio/pull/3406
[#3420]: https://github.com/magento/pwa-studio/pull/3420
[#3399]: https://github.com/magento/pwa-studio/pull/3399
[#3391]: https://github.com/magento/pwa-studio/pull/3391
[#3394]: https://github.com/magento/pwa-studio/pull/3394
[#3411]: https://github.com/magento/pwa-studio/pull/3411
[#3428]: https://github.com/magento/pwa-studio/pull/3428
[#3348]: https://github.com/magento/pwa-studio/pull/3348
[#3422]: https://github.com/magento/pwa-studio/pull/3422
[#3388]: https://github.com/magento/pwa-studio/pull/3388
[#3431]: https://github.com/magento/pwa-studio/pull/3431
[#3410]: https://github.com/magento/pwa-studio/pull/3410
[#3448]: https://github.com/magento/pwa-studio/pull/3448
[#3414]: https://github.com/magento/pwa-studio/pull/3414
[#3436]: https://github.com/magento/pwa-studio/pull/3436
[#3450]: https://github.com/magento/pwa-studio/pull/3450
[#3433]: https://github.com/magento/pwa-studio/pull/3433
[#3382]: https://github.com/magento/pwa-studio/pull/3382
[#3262]: https://github.com/magento/pwa-studio/pull/3262
[#3454]: https://github.com/magento/pwa-studio/pull/3454
[#3459]: https://github.com/magento/pwa-studio/pull/3459
[#3441]: https://github.com/magento/pwa-studio/pull/3441
[#3412]: https://github.com/magento/pwa-studio/pull/3412
[#3452]: https://github.com/magento/pwa-studio/pull/3452
[#3421]: https://github.com/magento/pwa-studio/pull/3421
[#3457]: https://github.com/magento/pwa-studio/pull/3457
[#3467]: https://github.com/magento/pwa-studio/pull/3467
[#3470]: https://github.com/magento/pwa-studio/pull/3470
[#3318]: https://github.com/magento/pwa-studio/pull/3318
[#3463]: https://github.com/magento/pwa-studio/pull/3463
[#3471]: https://github.com/magento/pwa-studio/pull/3471
[#3474]: https://github.com/magento/pwa-studio/pull/3474
[#3464]: https://github.com/magento/pwa-studio/pull/3464
[#3478]: https://github.com/magento/pwa-studio/pull/3478
[#3480]: https://github.com/magento/pwa-studio/pull/3480