# Release 12.3.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.3.0_
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

| | Home Page | Product Category | Product Details | Search Results |
| ------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| **Venia Pages** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
| Desktop Performance | ![](images/score_90.svg "Desktop & Mobile") | ![](images/score_78.svg "Desktop & Mobile") | ![](images/score_73.svg "Desktop & Mobile") | ![](images/score_90.svg "Desktop & Mobile") |
| Mobile Performance | ![](images/score_27.svg "Desktop & Mobile") | ![](images/score_27.svg "Desktop & Mobile") | ![](images/score_26.svg "Desktop & Mobile") | ![](images/score_33.svg "Desktop & Mobile") |
| Accessibility<br/>_(same for both)_ | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") |
| Best Practices<br/>_(same for both)_ | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") |
| SEO<br/>_(same for both)_ | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") | ![](images/score_100.svg "Desktop & Mobile") |
| PWA | ![Desktop](images/pwa_perfect.svg "Desktop") ![Mobile](images/pwa_imperfect.svg "Mobile") | ![](images/pwa_perfect.svg "Desktop & Mobile") | ![](images/pwa_perfect.svg "Desktop & Mobile") | ![](images/pwa_perfect.svg "Desktop & Mobile") |

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
| Story | Images to include dimensions                                                                                                                      | [3703][]                     |
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

-  Added [best practices documentation](https://developer.adobe.com/pwa-studio/guides/best-practices/index.html) for Customer Segments.

## Known Issues

-  Safari (macOS version) does not show toast messages or indicators when Venia switches between online and offline. This is an issue with Safari, not Venia. Safari always reports `true` for `navigator.onLine` — even when offline. We have submitted this issue to Apple. If you have an Apple account, you can search for the issue using this Feedback ID: FB9802994.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.1.0 to 12.2.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://magento.github.io/pwa-studio/tutorials/pwa-studio-fundamentals/project-setup/
[upgrading versions]: https://magento.github.io/pwa-studio/technologies/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.2.0, including the new venia-sample-data package.

**Note:**
Your project may not depend on some of the packages listed in this table.

| Package                             | Latest version |
|-------------------------------------|----------------|
| `babel-preset-peregrine`            | **1.2.0**      |
| `create-pwa`                        | **2.1.0**      |
| `upward-security-headers`           | **1.0.6**      |
| `venia-adobe-data-layer`            | **1.0.3**      |
| `venia-sample-data`                 | **0.0.1**      |
| `venia-sample-backends`             | **0.0.5**      |
| `venia-sample-language-packs`       | **0.0.6**      |
| `venia-sample-payments-checkmo`     | **0.0.4**      |
| `pagebuilder`                       | **7.1.0**      |
| `peregrine`                         | **12.2.0**     |
| `pwa-buildpack`                     | **11.1.0**     |
| `pwa-theme-venia`                   | **1.2.0**      |
| `upward-js`                         | **5.3.0**      |
| `upward-spec`                       | **5.2.0**      |
| `venia-concept`                     | **12.2.0**     |
| `venia-ui`                          | **9.2.0**      |
| `magento2-pwa`                      | **0.1.0**      |
| `magento-venia-sample-data-modules` | **0.0.1**      |
| `magento2-upward-connector`         | **2.0.0**      |
| `upward-php`                        | **2.0.0**      |

[3548]: https://github.com/magento/pwa-studio/pull/3548
[3519]: https://github.com/magento/pwa-studio/pull/3519
[35]: https://github.com/magento-commerce/pwa-tests/pull/35/files
[3508]: https://github.com/magento/pwa-studio/pull/3508
[3507]: https://github.com/magento/pwa-studio/pull/3507
[3509]: https://github.com/magento/pwa-studio/pull/3509
[34]: https://github.com/magento-commerce/pwa-tests/pull/34
[3505]: https://github.com/magento/pwa-studio/pull/3505
[31]: https://github.com/magento-commerce/pwa-tests/pull/31
[3504]: https://github.com/magento/pwa-studio/pull/3504
[29]: https://github.com/magento-commerce/pwa-tests/pull/29
[3588]: https://github.com/magento/pwa-studio/pull/3588
[3580]: https://github.com/magento/pwa-studio/pull/3580
[3594]: https://github.com/magento/pwa-studio/pull/3594
[9]: https://github.com/magento-commerce/venia-sample-data-modules/pull/9
[3486]: https://github.com/magento/pwa-studio/pull/3486
[3]: https://github.com/magento-commerce/magento2-pwa/pull/3
[9]: https://github.com/magento-commerce/magento2-pwa/pull/9
[7]: https://github.com/magento-commerce/magento2-pwa/pull/7
[8]: https://github.com/magento-commerce/magento2-pwa/pull/8
[3576]: https://github.com/magento/pwa-studio/pull/3576
[3616]: https://github.com/magento/pwa-studio/pull/3616
[3593]: https://github.com/magento/pwa-studio/pull/3593
[3598]: https://github.com/magento/pwa-studio/pull/3598
[3577]: https://github.com/magento/pwa-studio/pull/3577
[3589]: https://github.com/magento/pwa-studio/pull/3589
[3601]: https://github.com/magento/pwa-studio/pull/3601
[3597]: https://github.com/magento/pwa-studio/pull/3597
[3586]: https://github.com/magento/pwa-studio/pull/3586
[3526]: https://github.com/magento/pwa-studio/pull/3526
[3533]: https://github.com/magento/pwa-studio/pull/3533
[3525]: https://github.com/magento/pwa-studio/pull/3525
[36]: https://github.com/magento-commerce/pwa-tests/pull/36
[3518]: https://github.com/magento/pwa-studio/pull/3518
[37]: https://github.com/magento-commerce/pwa-tests/pull/37
[3500]: https://github.com/magento/pwa-studio/pull/3500
[27]: https://github.com/magento-commerce/pwa-tests/pull/27
[3491]: https://github.com/magento/pwa-studio/pull/3491
[3483]: https://github.com/magento/pwa-studio/pull/3483
[11]: https://github.com/magento-commerce/venia-sample-data-modules/pull/11
[3465]: https://github.com/magento/pwa-studio/pull/3465
[1]: https://github.com/magento-untitled-geese/venia-sample-data-modules/pull/1
[3521]: https://github.com/magento/pwa-studio/pull/3521
[3544]: https://github.com/magento/pwa-studio/pull/3544
[13]: https://github.com/magento-commerce/venia-sample-data-modules/pull/13
[3538]: https://github.com/magento/pwa-studio/pull/3538
[3529]: https://github.com/magento/pwa-studio/pull/3529
[11]: https://github.com/magento-commerce/magento2-upward-connector/pull/11
[3559]: https://github.com/magento/pwa-studio/pull/3559
[39]: https://github.com/magento-commerce/pwa-tests/pull/39
[3564]: https://github.com/magento/pwa-studio/pull/3564
[3555]: https://github.com/magento/pwa-studio/pull/3555
[3552]: https://github.com/magento/pwa-studio/pull/3552
[101]: https://github.com/magento-commerce/pwa-studio-cicd/pull/101
[3561]: https://github.com/magento/pwa-studio/pull/3561
[15]: https://github.com/magento-commerce/magento2-pwa/pull/15
[3654]: https://github.com/magento/pwa-studio/pull/3654
[3624]: https://github.com/magento/pwa-studio/pull/3624
[14]: https://github.com/magento-commerce/magento2-pwa/pull/14
[3619]: https://github.com/magento/pwa-studio/pull/3619
[18]: https://github.com/magento-commerce/magento2-pwa/pull/18
[3542]: https://github.com/magento/pwa-studio/pull/3542
[3551]: https://github.com/magento/pwa-studio/pull/3551
[3567]: https://github.com/magento/pwa-studio/pull/3567
[3571]: https://github.com/magento/pwa-studio/pull/3571
[3520]: https://github.com/magento/pwa-studio/pull/3520
[3515]: https://github.com/magento/pwa-studio/pull/3515
[3524]: https://github.com/magento/pwa-studio/pull/3524
[3553]: https://github.com/magento/pwa-studio/pull/3553
[3575]: https://github.com/magento/pwa-studio/pull/3575
[16]: https://github.com/magento-commerce/magento2-upward-connector/pull/16
[6]: https://github.com/magento-commerce/upward-php/pull/6
[3599]: https://github.com/magento/pwa-studio/pull/3599
[3622]: https://github.com/magento/pwa-studio/pull/3622
[3608]: https://github.com/magento/pwa-studio/pull/3608
[3573]: https://github.com/magento/pwa-studio/pull/3573
[3603]: https://github.com/magento/pwa-studio/pull/3603
[3584]: https://github.com/magento/pwa-studio/pull/3584
[3625]: https://github.com/magento/pwa-studio/pull/3625
[3655]: https://github.com/magento/pwa-studio/pull/3655
[18]: https://github.com/magento-commerce/magento2-upward-connector/pull/18
[16]: https://github.com/magento-commerce/venia-sample-data-modules/pull/16
[3658]: https://github.com/magento/pwa-studio/pull/3658/files
[3664]: https://github.com/magento/pwa-studio/pull/3664
[3665]: https://github.com/magento/pwa-studio/pull/3665
[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
[contactUs]: https://devdocs.magento.com/guides/v2.4/graphql/mutations/contact-us.html
