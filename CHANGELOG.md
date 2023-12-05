# PWA Studio Release 13.3.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 13.3.0_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 13.3.0 release of PWA Studio provides customers with many accessibility improvements for keyboard and screen-reader access, as well as several bug fixes. Full details are described below.

## Accessibility Updates

-  Bug: [4172][] — Reading wrong quantity into sub-folder of My account even when havnig atleast 1 item or more or zero has been fixed.
-  Bug: [4131][] — Once the account is created and the logged in users are announced as "Hi <username>" and the moment you press tab it highlight the area and announces as "Toggle my account menu button expanded"

## Additional fixes

-  Story: [4173][] — Price filter is now showing currency symbol
-  Story: [4090][] — Added additional user_errors parameter for cart addition and show error message if reported by Adobe Commerce.
-  Bug: [43][] — EAV attribute option loading Performance Issue resolved
-  Bug: [4124][] — Region is required in PWA even if this option is disabled in Magento has been fixed
-  Bug: [41][] - System is able to navigate to layered URL based on search term
-  Bug: [4168][] — System is able to navigate to layered URL based on search term
-  Bug: [4133][] — User is able to access category/subcategory pages even while active search
-  Bug: [4174][] — Error has been fixed on shipping address page to complete checkout for guest and registered user
-  Bug: [4143][] — Duplicate Queries were fired multiple times at time of load of page but after fix applied it is resolved
-  Bug: [40][] — User is able see checkmo option when checkmo checkout configuration is done for selceted country
-  Bug: [32][] - The system was thowing error with prex extension while adding the product to cart but after user can add product without any error with or without prex extension.
-  Bug: [113][] — The system was thowing error with prex extension while adding the product to cart but after user can add product without any error with or without prex extension.
-  Bug: [4135][] — Error message has been updated acording to action on Edit Item popup while updating unavailable quantity.
-  Bug: [38][] - Total number of iteam quantity is displayed as per configuration selected in backend
-  Bug: [4149][] — Total number of iteam quantity is displayed as per configuration selected in backend
-  Bug: [21][] — Error occurs when Runtime exception is thrown in vendor/magento/module-upward-connector/Model/PageType.php is resolved
-  Bug: [4129][] — Image is rendered on wrong pages when parallax is used on page builder.

## 13.3.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 13.3.0 release of these pages on desktop and mobile devices.

### Desktop scores

|                |            Home Page            |          Product Category           |          Product Details           |          Search Results           |
|---------------:|:-------------------------------:|:-----------------------------------:|:----------------------------------:|:---------------------------------:|
|    **Desktop** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
|    Performance |    ![](images/score_88.svg)     |      ![](images/score_94.svg)       |      ![](images/score_63.svg)      |     ![](images/score_96.svg)      |
|  Accessibility |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
| Best Practices |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            SEO |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            PWA |   ![](images/pwa_perfect.svg)   |     ![](images/pwa_perfect.svg)     |    ![](images/pwa_perfect.svg)     |    ![](images/pwa_perfect.svg)     |

### Mobile scores

|                | &nbsp;&nbsp;Home Page&nbsp;&nbsp; |          Product Category           |          Product Details           |          Search Results           |
|---------------:|:---------------------------------:|:-----------------------------------:|:----------------------------------:|:---------------------------------:|
|     **Mobile** |  ![](images/venia_page_home.png)  | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
|    Performance |     ![](images/score_23.svg)      |      ![](images/score_34.svg)       |      ![](images/score_27.svg)      |     ![](images/score_39.svg)      |
|  Accessibility |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
| Best Practices |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            SEO |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            PWA |    ![](images/pwa_perfect.svg)    |    ![](images/pwa_imperfect.svg)    |   ![](images/pwa_imperfect.svg)    |    ![](images/pwa_perfect.svg)    |


## Known issue

When a user logs out, that user's local storage session persists. As a result, the cart ID from the logged out user is retrieved and given to the _guest user_ on the computer. This causes the following error when the guest user tries to check out: `An error has occurred. Please check the input and try again.` To resolve this issue, try disabling graphql session sharing as described in the GraphQL documentation on session cookies here: https://devdocs.magento.com/guides/v2.4/graphql/authorization-tokens.html#session-cookies.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 13.2.0 to 13.3.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 13.3.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 13.2.0.

**NOTE:**
Your project may not depend on some packages listed in this table.

**[UPDATE THIS TABLE WITH THE LATEST VERSIONS OF EACH PACKAGE]**

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | **1.2.3***     |
| `create-pwa`                           | 2.4.5          |
| `experience-platform-connector`        | 1.0.5          |
| `upward-security-headers`              | 1.0.14         |
| `venia-sample-backends`                | 0.0.10         |
| `venia-sample-eventing`                | 0.0.6          |
| `venia-sample-language-packs`          | 0.0.14         |
| `venia-sample-payments-checkmo`        | 0.0.12         |
| `pagebuilder`                          | **8.2.1***     |
| `peregrine`                            | **13.2.1***    |
| `pwa-buildpack`                        | **11.4.3***    |
| `pwa-theme-venia`                      | 1.4.0          |
| `upward-js`                            | 5.3.2          |
| `upward-spec`                          | 5.2.1          |
| `venia-concept`                        | **13.3.0***    |
| `venia-ui`                             | **10.3.0***    |
| `magento2-pwa`                         | **0.6.2***     |
| `magento2-pwa-commerce`                | 0.0.3          |
| `magento-venia-sample-data-modules`    | 0.0.4          |
| `magento-venia-sample-data-modules-ee` | 0.0.3          |
| `magento2-upward-connector`            | **2.0.3***     |
| `upward-php`                           | 2.0.2          |

[4172]: https://github.com/magento/pwa-studio/pull/4172
[4131]: https://github.com/magento/pwa-studio/pull/4131
[4173]: https://github.com/magento/pwa-studio/pull/4173
[4090]: https://github.com/magento/pwa-studio/pull/4090
[43]: https://github.com/magento-commerce/magento2-pwa/pull/43
[4124]: https://github.com/magento/pwa-studio/pull/4124
[41]: https://github.com/magento-commerce/magento2-pwa/pull/41
[4168]: https://github.com/magento/pwa-studio/pull/4168
[4133]: https://github.com/magento/pwa-studio/pull/4133
[4174]: https://github.com/magento/pwa-studio/pull/4174
[4143]: https://github.com/magento/pwa-studio/pull/4143
[40]: https://github.com/magento-commerce/magento2-pwa/pull/40
[21]: https://github.com/magento-commerce/magento2-upward-connector/pull/21
[4129]: https://github.com/magento/pwa-studio/pull/4129
[38]: https://github.com/magento-commerce/magento2-pwa/pull/38
[4149]: https://github.com/magento/pwa-studio/pull/4149
[4135]: https://github.com/magento/pwa-studio/pull/4135
[32]: https://github.com/magento-commerce/venia-data-collector/pull/32
[113]: https://github.com/magento-commerce/venia-product-recommendations/pull/113

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
