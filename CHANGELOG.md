# PWA Studio Release 14.5.1

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.5.1_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 14.5.1 release of PWA Studio provides support to PHP 8.5 and  multiple bug fixes.

## Additional fixes
-  Bug:[4604][] — Updated the Axios package due to its vulnerability impact in PWA Studio
-  Bug:[30][] — Upward connector module error resolved by updating return type
-  Bug:[78][] — PHP 8.5 compatibility with PWA
-  Bug:[4607][] — Fixed issue where User unable to select option for few Configurable products
-  Bug:[4601][] — Clean up duplicated code between credit card and billing address
-  Bug:[4592][] - Fixed where breadcrumbs sortCrumbs function uses > instead of -, causing unreliable sort order


## 14.5.1 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits on four Venia page types, each representing a different level of complexity.
Shown below are the Lighthouse scores for the 14.5.1 release of these pages on desktop and mobile devices.
### Desktop scores

|                |            Home Page            |          Product Category           |          Product Details           |          Search Results           |
|---------------:|:-------------------------------:|:-----------------------------------:|:----------------------------------:|:---------------------------------:|
|    **Desktop** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
|    Performance |    ![](images/score_98.svg)     |      ![](images/score_98.svg)       |      ![](images/score_98.svg)      |     ![](images/score_98.svg)      |
|  Accessibility |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
| Best Practices |    ![](images/score_75.svg)    |      ![](images/score_75.svg)      |     ![](images/score_75.svg)      |     ![](images/score_75.svg)     |
|            SEO |    ![](images/score_94.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            PWA |   ![](images/pwa_perfect.svg)   |     ![](images/pwa_perfect.svg)     |    ![](images/pwa_perfect.svg)     |    ![](images/pwa_perfect.svg)     |


### Mobile scores

|                | &nbsp;&nbsp;Home Page&nbsp;&nbsp; |          Product Category           |          Product Details           |          Search Results           |
|---------------:|:---------------------------------:|:-----------------------------------:|:----------------------------------:|:---------------------------------:|
|     **Mobile** |  ![](images/venia_page_home.png)  | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
|    Performance |     ![](images/score_70.svg)      |      ![](images/score_67.svg)       |      ![](images/score_70.svg)      |     ![](images/score_75.svg)      |
|  Accessibility |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
| Best Practices |     ![](images/score_75.svg)     |      ![](images/score_75.svg)      |     ![](images/score_75.svg)      |     ![](images/score_75.svg)     |
|            SEO |     ![](images/score_94.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            PWA |    ![](images/pwa_perfect.svg)    |    ![](images/pwa_imperfect.svg)    |   ![](images/pwa_imperfect.svg)    |    ![](images/pwa_perfect.svg)    |


## Known issue

When a user logs out, that user's local storage session persists. As a result, the cart ID from the logged-out user is retrieved and assigned to the guest user on the same computer.
This causes the following error when the guest user tries to check out:
An error has occurred. Please check the input and try again. 

To resolve this issue, try disabling graphql session sharing as described in the GraphQL documentation on session cookies here: https://devdocs.magento.com/guides/v2.4/graphql/authorization-tokens.html#session-cookies.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 14.5.0 to 14.5.1
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 14.5.1. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 14.5.0.

**NOTE:**
Your project may not depend on some packages listed in this table.

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | 1.3.3          |
| `create-pwa`                           | **2.5.10***     |
| `experience-platform-connector`        | **1.0.13***    |
| `upward-security-headers`              | **1.1.21***    |
| `venia-sample-backends`                | 0.0.13         |
| `venia-sample-eventing`                | **0.0.14***    |
| `venia-sample-language-packs`          | **0.0.22***    |
| `venia-sample-payments-checkmo`        | **0.0.20***    |
| `venia-sample-payments-cashondelivery` | **0.0.5***     |
| `venia-pwa-live-search`                | **1.0.3***     |
| `venia-product-recommendations`        | 1.0.2          |
| `plugin-braintree-three-d-secure`      | 1.0.1          |
| `pagebuilder`                          | **9.3.8***     |
| `peregrine`                            | **15.7.3***    |
| `pwa-buildpack`                        | 11.5.5         |
| `pwa-theme-venia`                      | 2.4.0          |
| `upward-js`                            | 5.4.3          |
| `upward-spec`                          | 5.3.1          |
| `venia-concept`                        | **14.5.1***    |
| `venia-ui`                             | **11.7.3***    |
| `magento2-pwa`                         | **0.10.4***    |
| `magento2-pwa-commerce`                | **0.1.6***     |
| `magento-venia-sample-data-modules`    | **0.0.7***     |
| `magento-venia-sample-data-modules-ee` | **0.0.7***     |
| `magento2-upward-connector`            | **2.1.7***     |
| `upward-php`                           | **2.1.5***     |
| `pwa-live-search`                      | **1.0.1***     |

[4604]: https://github.com/magento/pwa-studio/pull/4604
[30]: https://github.com/magento-commerce/magento2-upward-connector/pull/30
[78]: https://github.com/magento-commerce/magento2-pwa/pull/78
[4607]: https://github.com/magento/pwa-studio/pull/4607
[4601]: https://github.com/magento/pwa-studio/pull/4601
[4592]: https://github.com/magento/pwa-studio/pull/4592

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
