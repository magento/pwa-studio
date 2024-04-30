# PWA Studio Release 14.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.0.0_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 14.0.0 release of PWA Studio provides customers with many accessibility improvements for keyboard and screen-reader access, as well as several bug fixes. Full details are described below.

## Accessibility Updates

-  Bug: [4195][] — Only one folder should be remained open when navigating the control from profile to minicart or viceversa

## Additional fixes

-  Story: [4196][] — Updated Tailwind to V3
-  Bug: [4207][] — yarn install broken after #4191
-  Bug: [4235][] — Search products by category from searchBar is working according to searched text.
-  Bug: [4180][] - Layered navigation Options are not visible when no results are available
-  Bug: [4194][] — Thumbnail Images are getting are now not hidden due to PR
-  Bug: [4221][] — Broken Sign-in following 13.3.0 is fixed
-  Bug: [48][] — Exception causes error on PWA build  is resolved
-  Bug: [4221][] — mergeCarts GraphQl Error is resolved
-  Bug: [4210][] - Version updated in extension.
-  Bug: [22][] — PWA Upward connector throwing exception resolved
-  Bug: [4229][] — Order statuses are decoupled from the back-end
-  Bug: [4231][] - Unable to sign-In using TAB/ Mouse Click button from Sign in Page is resolved
-  Bug: [49][] — PWA metapackages should support PHP8.3
-  Bug: [28][] — Unable to complile local code with venia-sample data package in local now resolved
-  Bug: [4183][] — Products not found using URL key is not resolved
-  Bug: [4240][] — GraphQL cacheable requests always have "Authorization Bearer" header is now changed to only for non cached pages
-  Bug: [4227][] — Experience platform connector extension missing parent sku is now added


## 14.0.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 14.0.0 release of these pages on desktop and mobile devices.

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

Use the steps outlined in this section to update your [scaffolded project][] from 13.3.0 to 14.0.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 14.0.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 13.3.0.

**NOTE:**
Your project may not depend on some packages listed in this table.

**[UPDATE THIS TABLE WITH THE LATEST VERSIONS OF EACH PACKAGE]**

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | 1.2.3          |
| `create-pwa`                           | **2.4.6***     |
| `experience-platform-connector`        | **1.0.6***     |
| `upward-security-headers`              | **1.0.15***    |
| `venia-sample-backends`                | 0.0.10         |
| `venia-sample-eventing`                | **0.0.7***     |
| `venia-sample-language-packs`          | **0.0.15***    |
| `venia-sample-payments-checkmo`        | **0.0.13***    |
| `pagebuilder`                          | **9.2.1***     |
| `peregrine`                            | **14.2.1***    |
| `pwa-buildpack`                        | 11.4.3         |
| `pwa-theme-venia`                      | **2.4.0***     |
| `upward-js`                            | 5.3.2          |
| `upward-spec`                          | 5.2.1          |
| `venia-concept`                        | **14.0.0***    |
| `venia-ui`                             | **11.3.0***    |
| `magento2-pwa`                         | **0.7.2***     |
| `magento2-pwa-commerce`                | **0.0.4***     |
| `magento-venia-sample-data-modules`    | **0.0.5***     |
| `magento-venia-sample-data-modules-ee` | **0.0.4***     |
| `magento2-upward-connector`            | **2.0.4***     |
| `upward-php`                           | **2.0.3***     |

[4196]: https://github.com/magento/pwa-studio/pull/4196
[4207]: https://github.com/magento/pwa-studio/pull/4207
[4235]: https://github.com/magento/pwa-studio/pull/4235
[4180]: https://github.com/magento/pwa-studio/pull/4180
[4194]: https://github.com/magento/pwa-studio/pull/4194
[4221]: https://github.com/magento/pwa-studio/pull/4221
[48]: https://github.com/magento-commerce/magento2-pwa/pull/48
[49]: https://github.com/magento-commerce/magento2-pwa/pull/49
[4210]: https://github.com/magento/pwa-studio/pull/4210
[22]: https://github.com/magento-commerce/magento2-upward-connector/pull/22
[4229]: https://github.com/magento/pwa-studio/pull/4229
[4231]: https://github.com/magento/pwa-studio/pull/4231
[49]: https://github.com/magento-commerce/magento2-pwa/pull/49
[28]: https://github.com/magento-commerce/venia-sample-data-modules/pull/28
[4183]: https://github.com/magento/pwa-studio/pull/4183
[4240]: https://github.com/magento/pwa-studio/pull/4240
[4227]: https://github.com/magento/pwa-studio/pull/4227

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
