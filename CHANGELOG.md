# PWA Studio Release 12.6.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.6.0_.
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 12.6.0 release of PWA Studio focuses on accessibility improvements and bug fixes.
  
-   Accessibility Improvements: Added autocomplete attributes to checkout shipping and payment forms — [3785][]  
-   Accessibility Improvements:: Open panels now have keyboard focus. — [3805][]   
-   Accessibility Improvements:: Navigation buttons for carousels now meet contrast requirements. — [3787][]  
-   Controls now have a descriptive accessible name. Visible \[label] elements are correctly associated with their inputs using the "for" attribute. — [3786][]  
-   Removes duplicate logic from QuoteGraphQlPwa module — [29][]  
-   Bug Fix: Failing cypress tests fixed — [3911][]  
-   Bug Fix - Braintree payment form Customer Name field values now appear normal. — [3912][]  
-   Bug Fix: Braintree npm package braintree-web-drop-in updated to latest version to fix csp related console errors. — [3912][]  
-   Accessibility Improvements: Keyboard focus no longer lands on hidden elements in Kebab menu — [3800][]   
-   Fixed a bug in mobile view where the Edit and Remove options in the kebab menu for a cart item on the cart page is non functional. - [3925][]
-   Fixed a console error when accessing different filters. - [30][]

## 12.6.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 12.6.0 release of these pages on desktop and mobile devices.

### Desktop scores

|               | Home Page | Product Category | Product Details | Search Results |
| ------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| **Desktop** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
| Performance | ![](images/score_88.svg) | ![](images/score_94.svg) | ![](images/score_63.svg) | ![](images/score_96.svg) |
| Accessibility | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| Best Practices | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| SEO | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| PWA | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) |

### Mobile scores

|               | &nbsp;&nbsp;Home Page&nbsp;&nbsp; | Product Category | Product Details | Search Results |
| ------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| **Mobile** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
| Performance | ![](images/score_23.svg) | ![](images/score_34.svg) | ![](images/score_27.svg) | ![](images/score_39.svg) |
| Accessibility | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| Best Practices | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| SEO | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| PWA | ![](images/pwa_perfect.svg) | ![](images/pwa_imperfect.svg) | ![](images/pwa_imperfect.svg) | ![](images/pwa_perfect.svg) |

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.5.0 to 12.6.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.6.0.

**Note:**
Your project may not depend on some packages listed in this table.

| Package                             | Latest version |
|-------------------------------------|----------------|
| `babel-preset-peregrine`            | **1.2.1**      |
| `create-pwa`                        | **2.3.2**      |
| `experience-platform-connector`     | **1.0.1**      |
| `upward-security-headers`           | **1.0.10**     |
| `venia-sample-backends`             | **0.0.8**      |
| `venia-sample-eventing`             | **0.0.2**      |
| `venia-sample-language-packs`       | **0.0.10**     |
| `venia-sample-payments-checkmo`     | **0.0.8**      |
| `pagebuilder`                       | **7.5.0**      |
| `peregrine`                         | **12.5.0**     |
| `pwa-buildpack`                     | **11.4.0**     |
| `pwa-theme-venia`                   | **1.4.0**      |
| `upward-js`                         | **5.4.0**      |
| `upward-spec`                       | **5.2.1**      |
| `venia-concept`                     | **12.6.0**     |
| `venia-ui`                          | **9.6.0**      |
| `magento2-pwa`                      | **0.3.0**      |
| `magento2-pwa-commerce`             | **0.0.2**      |
| `magento-venia-sample-data-modules` | **0.0.3**      |
| `magento-venia-sample-data-modules-ee`| **0.0.2**    |
| `magento2-upward-connector`         | **2.0.1**      |
| `upward-php`                        | **2.0.1**      |

[3785]: https://github.com/magento/pwa-studio/pull/3785
[3805]: https://github.com/magento/pwa-studio/pull/3805
[3787]: https://github.com/magento/pwa-studio/pull/3787
[3786]: https://github.com/magento/pwa-studio/pull/3786
[29]: https://github.com/magento-commerce/magento2-pwa/pull/29
[3911]: https://github.com/magento/pwa-studio/pull/3911
[3912]: https://github.com/magento/pwa-studio/pull/3912
[3800]: https://github.com/magento/pwa-studio/pull/3800
[30]: https://github.com/magento-commerce/magento2-pwa/pull/30
[3925]: https://github.com/magento/pwa-studio/pull/3925
[29]: https://github.com/magento-commerce/magento2-pwa/pull/29

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
