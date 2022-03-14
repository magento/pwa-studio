# PWA Studio Release 12.3.0

**NOTE:**
_This changelog contains release notes for PWA Studio and Venia 12.3.0_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

### Personalized content support

-   Added shimmer loaders for Dynamic blocks to avoid layout shift. Shimmer loaders are only rendered if `minHeight` is specified on the Row containing the Dynamic block. This implementation gives you a choice: You can set the Row's `minHeight` to render the shimmer or remove the `minHeight` to remove the shimmer. For Dynamic blocks that rarely render, we recommend removing the `minHeight` property from the Rows containing those Dynamic blocks. — [3713][]
-   Added the new `PersonalizedContentSampleDataVenia` module that contains customer segments, dynamic blocks, and cart rule promotion sample data for personalized content. — [19][],[2][],[3670][]
-   Shopping cart promotions are now properly displayed depending on customer segment. — [3609][]
-   You can now make GraphQL queries for dynamic blocks. — [3587][],[2][]

### ReCaptcha support

-   You can now use ReCaptcha V3 on the Braintree payment form and the Place Order form. — [3691][],[24][]
-   reCAPTCHA V3 validation is now available on the following customer forms:
    - Customer Login
    - Customer account creation
    - Customer information change (password) — [3702][]
    - Forgot Password form. — [3604][],[12][],[20][]

### PageBuilder content optimization

-   Shimmers are now loaded when rendering a Page Builder CMS page. This helps reduce CLS and increase load speed. — [3711][]
-   Images from Page Builder content now include height and width dimensions. This helps reduce CLS when rendering the images. — [3712][]
-   Store-view specific label and localization support has been added for product attributes. — [17][]
-   PWA Studio can now retrieve image metadata from Page Builder. — [16][],[17][]

### Other highlights

-  In the Link component, `prefetchType` property has been renamed to `shouldPrefetch`. This helps to clarify that it is a boolean, rather a property that returns a type. `prefetchType` is deprecated but not removed. — [3646][]
-  Refactored the reCaptcha to ensure it is backwards compatible with 12.2.0. — [3696][]
-  The "Sign In" link has been removed from the 2nd stage of checkout. This ensures the cart configuration (guest or account holder) does not change in the middle of checkout. — [3672][]
-  Dependency packages have been updated. See https://github.com/magento/pwa-studio/pull/3611 for more details about specific package versions. — [3611][]
-  Reporting has been improved when running Cypress tests on a headless instance. — [3613][]
-  Adobe Commerce users can now set gift options on the Order level. — [3540][]
-  Long Wish List names no longer break the layout or force users to scroll in order to close modal dialogs. — [3706][]
-  Products with configurable product variants are now properly added to Wish Lists. Previously, adding a configurable product threw an error. — [3703][]
-  The virtual products extension has been removed. — [3612][]
-  To increase performance, instances of the *useMemo* type have been changed to *const* in the *productUrlSuffix* talon. — [3660][]
-  Added support that makes it easier to click-select tabs when they are displayed in a long list of Tab Items from Page Builder. — [3676][]

## 12.3.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 12.3.0 release of these pages on desktop and mobile devices.

### Desktop scores
|  | Home Page | Product Category | Product Details | Search Results |
| ------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| **Desktop** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
| Performance | ![](images/score_90.svg) | ![](images/score_78.svg) | ![](images/score_73.svg) | ![](images/score_90.svg) |
| Accessibility | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| Best Practices | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| SEO | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| PWA | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) |

### Mobile scores

|  | &nbsp;&nbsp;Home Page&nbsp;&nbsp; | Product Category | Product Details | Search Results |
| ------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| **Mobile** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
| Performance | ![](images/score_27.svg) | ![](images/score_27.svg) | ![](images/score_26.svg) | ![](images/score_33.svg) |
| Accessibility | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| Best Practices | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| SEO | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| PWA | ![](images/pwa_imperfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) |

## Stories and bug fixes

| Type  | Description                                                                                                                                       | GitHub PR                       |
| :---- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------ |
| Story | Shimmer Loader for Dynamic Blocks                                                                                                                 | [3713][]                      |
| Story | Query for available Dynamic Blocks                                                                                                                | [3587][], [2][]               |
| Story | CMS Page Shimmer Loader                                                                                                                           | [3711][]                      |
| Story | Update the Sample Data with Personalized content                                                                                                  | [19][], [2][], [3670][]       |
| Story | reFactored reCAPTCHA                                                                                                                              | [3696][]                      |
| Story | Add reCaptcha to the Checkout Forms                                                                                                               | [3691][], [24][]              |
| Story | Add reCaptcha to the Account Information Forms                                                                                                    | [3702][]                      |
| Story | Add reCaptcha to the Forgot Password  Form                                                                                                        | [3604][], [12][], [20][]      |
| Story | Rename Link's prefetchType prop                                                                                                                   | [3646][]                      |
| Story | Store view specific label/localization support for product attributes                                                                             | [17][]                        |
| Story | Update Magento capability table                                                                                                                   | [3724][]                      |
| Story | Remove Sign-In link on 2nd step of checkout                                                                                                       | [3672][]                      |
| Story | Images to include dimensions                                                                                                                      | [files][]                     |
| Story | Validate Shopping Cart Promotions are displayed correctly                                                                                         | [3609][]                      |
| Story | Configurable images are not shown in Edit Cart Item menu                                                                                          | [3695][]                      |
| Story | Backend PageBuilder image metadata support                                                                                                        | [16][], [17][]                |
| Story | Update packages and dependencies                                                                                                                  | [3611][]                      |
| Story | Add cypress status reporting while running headless                                                                                               | [3613][]                      |
| Bug   | Gift options on Order Level (Commerce only)                                                                                                       | [3540][]                      |
| Bug   | Parent product image thumbnail has been shown in mini cart instead of product itself                                                              | [3690][]                      |
| Bug   | Long wishlist name length breaks layout                                                                                                           | [3706][]                      |
| Bug   | Change default sort order on Search page to 'Best Match'                                                                                          | [3698][]                      |
| Bug   | Wishlist page error when configured variant added                                                                                                 | [3703][]                      |
| Bug   | Fix Cypress Page Builder tests                                                                                                                    | [3715][]                      |
| Bug   | Dynamic Blocks GraphQL returns non-qualified blocks                                                                                               | [3678][], [3][]               |
| Bug   | Remove virtual products extension                                                                                                                 | [3612][]                      |
| Bug   | Possible wrong usage of useMemo                                                                                                                   | [3660][]                      |
| Bug   | PWA multiple wish lists: storefront still showing create wishlist button when reaching the max number of allowed wish lists configured in Commerce| [3668][]                      |
| Bug   | Header - Logo dimensions overlap with main content                                                                                                | [3659][]                      |
| Bug   | Click target for long-spanning tabs is inconsistent                                                                                               | [3676][]                      |
| Bug   | Venia sample data personalized content not updating                                                                                               | [20][]                        |

## Documentation updates

-   Added [best practices documentation](https://developer.adobe.com/pwa-studio/guides/best-practices/index.html) for Customer Segments.

## Known issues

-  In some scenarios, applying a coupon to a guest cart will fail if a coupon has already been applied in a separate cart in the same browser.
   For instance: As a logged-in user, apply a coupon to the cart and then log out. Then try to apply a coupon to a second, guest cart. This second coupon may raise an error. Clearing the cache solves the issue.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.2.0 to 12.3.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.3.0.

**Note:**
Your project may not depend on some of the packages listed in this table.

| Package                             | Latest version |
|-------------------------------------|----------------|
| `babel-preset-peregrine`            | **1.2.0**      |
| `create-pwa`                        | **2.2.0**      |
| `upward-security-headers`           | **1.0.7**      |
| `venia-adobe-data-layer`            | **1.0.4**      |
| `venia-sample-backends`             | **0.0.6**      |
| `venia-sample-language-packs`       | **0.0.7**      |
| `venia-sample-payments-checkmo`     | **0.0.5**      |
| `pagebuilder`                       | **7.2.0**      |
| `peregrine`                         | **12.3.0**     |
| `pwa-buildpack`                     | **11.2.0**     |
| `pwa-theme-venia`                   | **1.2.0**      |
| `upward-js`                         | **5.3.0**      |
| `upward-spec`                       | **5.2.0**      |
| `venia-concept`                     | **12.3.0**     |
| `venia-ui`                          | **9.3.0**      |
| `magento2-pwa`                      | **0.2.0**      |
| `magento2-pwa-commerce`             | **0.0.1**      |
| `magento-venia-sample-data-modules` | **0.0.2**      |
| `magento-venia-sample-data-modules-ee`| **0.0.1**    |
| `magento2-upward-connector`         | **2.0.0**      |
| `upward-php`                        | **2.0.0**      |


[3713]: https://github.com/magento/pwa-studio/pull/3713
[19]: https://github.com/magento-commerce/venia-sample-data-modules/pull/19.
[2]: https://github.com/magento-commerce/venia-sample-data-modules-ee/pull/2
[3670]: https://github.com/magento/pwa-studio/pull/3670
[3691]: https://github.com/magento/pwa-studio/pull/3691
[24]: https://github.com/magento-commerce/magento2-pwa/pull/24
[3702]: https://github.com/magento/pwa-studio/pull/3702
[3604]: https://github.com/magento/pwa-studio/pull/3604
[12]: https://github.com/magento-commerce/magento2-pwa/pull/12
[20]: https://github.com/magento-commerce/magento2-pwa/pull/20
[25]: https://github.com/magento-commerce/magento2-pwa/pull/25
[4]: https://github.com/magento-commerce/magento2-pwa-commerce/pull/4
[22]: https://github.com/magento-commerce/venia-sample-data-modules/pull/22
[3]: http://github.com/magento-commerce/venia-sample-data-modules-ee/pull/3
[3646]: https://github.com/magento/pwa-studio/pull/3646
[17]: https://github.com/magento-commerce/magento2-pwa/pull/17
[3724]: https://github.com/magento/pwa-studio/pull/3724
[3696]: https://github.com/magento/pwa-studio/pull/3696
[3672]: https://github.com/magento/pwa-studio/pull/3672
[3712]: https://github.com/magento/pwa-studio/pull/3712/files
[3609]: https://github.com/magento/pwa-studio/pull/3609
[3587]: https://github.com/magento/pwa-studio/pull/3587
[2]: https://github.com/magento-commerce/magento2-pwa-commerce/pull/2
[3695]: https://github.com/magento/pwa-studio/pull/3695
[16]: https://github.com/magento-commerce/magento2-pwa/pull/16
[17]: https://github.com/magento-commerce/venia-sample-data-modules/pull/17
[14]: https://github.com/magento-commerce/venia-sample-data-modules/pull/14
[11]: https://github.com/magento-commerce/magento2-pwa/pull/11
[7]: https://github.com/magento-commerce/upward-php/pull/7
[17]: https://github.com/magento-commerce/magento2-upward-connector/pull/17
[3611]: https://github.com/magento/pwa-studio/pull/3611
[3711]: https://github.com/magento/pwa-studio/pull/3711
[3613]: https://github.com/magento/pwa-studio/pull/3613
[3540]: https://github.com/magento/pwa-studio/pull/3540
[3690]: https://github.com/magento/pwa-studio/pull/3690
[3706]: https://github.com/magento/pwa-studio/pull/3706
[3698]: https://github.com/magento/pwa-studio/pull/3698
[3703]: https://github.com/magento/pwa-studio/pull/3703
[3715]: https://github.com/magento/pwa-studio/pull/3715
[3678]: https://github.com/magento/pwa-studio/pull/3678
[3]: https://github.com/magento-commerce/magento2-pwa-commerce/pull/3
[3612]: https://github.com/magento/pwa-studio/pull/3612
[3660]: https://github.com/magento/pwa-studio/pull/3660
[3668]: https://github.com/magento/pwa-studio/pull/3668
[3659]: https://github.com/magento/pwa-studio/pull/3659
[3676]: https://github.com/magento/pwa-studio/pull/3676
[20]: https://github.com/magento-commerce/venia-sample-data-modules/pull/20
[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
