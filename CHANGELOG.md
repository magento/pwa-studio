# PWA Studio Release 13.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 13.0.0_.
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 13.0 release of PWA Studio provides customers with many accessibility improvements for keyboard and screen-reader access, as well as several bug fixes. Full details are described below.

## Accessibility Updates

-  Story: [3865][] — Venia's main menu and modals now prevent the background page from scrolling.
-  Story: [3952][] — Added visible text labels to all Venia buttons.
-  Story: [3944][] — Added alt text to images and removed screen reader access to hidden content on the Order History page.
-  Story: [3971][] — Added visual indication to show when page content has been refreshed.
-  Story: [3977][] — Added expanded and collapsed states for the Accordion control.
-  Story: [3932][] — Matched the accessible name of buttons to their visible text labels.
-  Story: [3973][] — Enabled keyboard navigation on the Cart page.
-  Story: [3980][] — Enabled keyboard navigation on the Checkout page.
-  Story: [3961][] — Labeled required form fields as required.
-  Story: [3978][] — Enabled keyboard navigation on Sign In and Create Account pages.
-  Story: [3988][] — Added Accessible names to all icon buttons.
-  Story: [3979][] — Enabled keyboard navigation on Checkout page.
-  Story: [3962][] — Added visual indications of focus state on buttons.
-  Story: [3931][] — Added page title to the Search page for screen readers.
-  Story: [4006][] — Added additional documentation and video links to the README for magento/pwa-studio.

## Bug fixes

-  Bug: [31][] — Fixed the issue where the `setup:upgrade` command got stuck at the `Magento_PageBuilderPwa` step when PageBuilder contained 20+ MB of assets.
-  Bug: [3982][] — Replaced `id` with `uid` in `noProductsFound.js` to give a unique value for each category and resolve the browser console warning.
-  Bug: [4001][] — Fixed the redirection URL for the Add to Cart button on a configurable product gallery item to match the URL used on the product tile.
-  Bug: [3874][] — Fixed all hooks and talons to use named exports to prevent errors when using them for wrapping.
-  Bug: [4011][] — Fixed `tabIndex` prop type on `categoryBranch`, categoryLeaf, and categoryTree.
-  Bug: [4011][] — Fixed accessibility issue on home page with carousel gallery item links by adding aria-label for link names.
-  Bug: [4019][] — Fixed an issue in which the `addToCart` event would crash the app when contexts were not set.
-  Bug: [4025][] — Fixed `productPageView` event to capture and add more data when setting the `productPageView` context.

## 13.0.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 13.0.0 release of these pages on desktop and mobile devices.

### Desktop scores

|                |            Home Page            |          Product Category           |          Product Details           |          Search Results           |
| -------------: | :-----------------------------: | :---------------------------------: | :--------------------------------: | :-------------------------------: |
|    **Desktop** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
|    Performance |    ![](images/score_88.svg)     |      ![](images/score_94.svg)       |      ![](images/score_63.svg)      |     ![](images/score_96.svg)      |
|  Accessibility |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     | ![](images/score_100.svg) 
| Best Practices |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     | ![](images/score_100.svg) 
|            SEO |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     | ![](images/score_100.svg) 
|            PWA |   ![](images/pwa_perfect.svg)   |     ![](images/pwa_perfect.svg)     |    ![](images/pwa_perfect.svg)     |    ![](images/pwa_perfect.svg)    | ![](images/pwa_perfect.svg) 

### Mobile scores

|                | &nbsp;&nbsp;Home Page&nbsp;&nbsp; |          Product Category           |          Product Details           |          Search Results           |
| -------------: | :-------------------------------: | :---------------------------------: | :--------------------------------: | :-------------------------------: |
|     **Mobile** |  ![](images/venia_page_home.png)  | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
|    Performance |     ![](images/score_23.svg)      |      ![](images/score_34.svg)       |      ![](images/score_27.svg)      |     ![](images/score_39.svg)      |
|  Accessibility |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
| Best Practices |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            SEO |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            PWA |    ![](images/pwa_perfect.svg)    |    ![](images/pwa_imperfect.svg)    |   ![](images/pwa_imperfect.svg)    |    ![](images/pwa_perfect.svg)    |

## Known issue

When a user logs out, that user's local storage session persists. As a result, the cart ID from the logged out user is retrieved and given to the _guest user_ on the computer. This causes the following error when the guest user tries to check out: `An error has occurred. Please check the input and try again.` To resolve this issue, try disabling graphql session sharing as described in the GraphQL documentation on session cookies here: https://devdocs.magento.com/guides/v2.4/graphql/authorization-tokens.html#session-cookies.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.7.0 to 13.0.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 13.0.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 12.7.0.

**Note:**
Your project may not depend on some packages listed in this table.

| Package                                | Latest version |
| -------------------------------------- | -------------- |
| `babel-preset-peregrine`               | 1.2.2          |
| `create-pwa`                           | **2.3.4***     |
| `experience-platform-connector`        | **1.0.3***     |
| `upward-security-headers`              | **1.0.12***    |
| `venia-sample-backends`                | 0.0.9          |
| `venia-sample-eventing`                | **0.0.4***     |
| `venia-sample-language-packs`          | **0.0.12***    |
| `venia-sample-payments-checkmo`        | **0.0.10***    |
| `pagebuilder`                          | **8.0.0***     |
| `peregrine`                            | **13.0.0***    |
| `pwa-buildpack`                        | 11.4.1         |
| `pwa-theme-venia`                      | 1.4.0          |
| `upward-js`                            | 5.3.2          |
| `upward-spec`                          | 5.3.1          |
| `venia-concept`                        | **13.0.0***    |
| `venia-ui`                             | **10.0.0***    |
| `magento2-pwa`                         | 0.3.0          |
| `magento2-pwa-commerce`                | 0.0.2          |
| `magento-venia-sample-data-modules`    | 0.0.3          |
| `magento-venia-sample-data-modules-ee` | 0.0.2          |
| `magento2-upward-connector`            | 2.0.1          |
| `upward-php`                           | 2.0.1          |

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
[31]: https://github.com/magento-commerce/magento2-pwa/pull/31
[3865]: https://github.com/magento/pwa-studio/pull/3865
[3952]: https://github.com/magento/pwa-studio/pull/3952
[4006]: https://github.com/magento/pwa-studio/pull/4006
[3944]: https://github.com/magento/pwa-studio/pull/3944
[3971]: https://github.com/magento/pwa-studio/pull/3971
[3977]: https://github.com/magento/pwa-studio/pull/3977
[3932]: https://github.com/magento/pwa-studio/pull/3932
[3973]: https://github.com/magento/pwa-studio/pull/3973
[3980]: https://github.com/magento/pwa-studio/pull/3980
[3961]: https://github.com/magento/pwa-studio/pull/3961
[3978]: https://github.com/magento/pwa-studio/pull/3978
[3988]: https://github.com/magento/pwa-studio/pull/3988
[3979]: https://github.com/magento/pwa-studio/pull/3979
[3962]: https://github.com/magento/pwa-studio/pull/3962
[3931]: https://github.com/magento/pwa-studio/pull/3931
[3982]: https://github.com/magento/pwa-studio/pull/3982
[4001]: https://github.com/magento/pwa-studio/pull/4001
[3874]: https://github.com/magento/pwa-studio/pull/3874
[4011]: https://github.com/magento/pwa-studio/pull/4011
[4011]: https://github.com/magento/pwa-studio/pull/4011
[4019]: https://github.com/magento/pwa-studio/pull/4019
[4025]: https://github.com/magento/pwa-studio/pull/4025
