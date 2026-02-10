# PWA Studio Release 14.5.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.5.0_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 14.5.0 release of PWA Studio provides multiple bug fixes and updated Documentation for Live Search, Prex and multistore setup.

## Additional fixes
-  Story:[4587][] — Robots meta tag are added in head tag from magento configuration
-  Bug:[4597][] — Canonical link tags are getting generated now.
-  Bug:[4586][] — Cart items are now visible on return visit until a new item is added
-  Bug:[4574][] — fixed Homepage UI breaking in venia.magento.com
-  Bug:[4552][] — The 404 page renders as expected
-  Bug:[4471][] - Fixed Lighthouse Test Failures in PR.
-  Bug:[4589][] - Fixed webpack path resolver.
-  Bug:[4588][] - Issue on IOS while installing app is resolved
-  Bug:[29][] - UPWARD PHP Resolver Throwing 500 Error for Disabled Products is fixed
-  Bug:[73][] -  Mobile image dimensions changes when using the PWA PageBuilder Image component issue is fixed
-  Bug:[4583][] - Stale cartId after guest user logs in is fixed
-  Bug:[4576][] - Links do not open in new window when added using WYSIWYG Editor on PageBuilder Text element is fixed 
-  Bug:[4579][] - PDP add to cart action refetching the query getProductDetailForProductPage multiple times has been fixed

## 14.4.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits on four Venia page types, each representing a different level of complexity.
Shown below are the Lighthouse scores for the 14.5.0 release of these pages on desktop and mobile devices.
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

Use the steps outlined in this section to update your [scaffolded project][] from 14.4.0 to 14.5.0
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 14.5.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 14.4.0.

**NOTE:**
Your project may not depend on some packages listed in this table.

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | 1.3.3          |
| `create-pwa`                           | **2.5.9***     |
| `experience-platform-connector`        | **1.0.12***    |
| `upward-security-headers`              | **1.1.20***    |
| `venia-sample-backends`                | 0.0.13         |
| `venia-sample-eventing`                | **0.0.13***    |
| `venia-sample-language-packs`          | **0.0.21***    |
| `venia-sample-payments-checkmo`        | **0.0.19***    |
| `venia-sample-payments-cashondelivery` | **0.0.4***     |
| `venia-pwa-live-search`                | **1.0.2***     |
| `venia-product-recommendations`        | 1.0.2          |
| `plugin-braintree-three-d-secure`      | 1.0.1          |
| `pagebuilder`                          | **9.3.7***     |
| `peregrine`                            | **15.7.2***    |
| `pwa-buildpack`                        | 11.5.5         |
| `pwa-theme-venia`                      | 2.4.0          |
| `upward-js`                            | 5.4.3          |
| `upward-spec`                          | 5.3.1          |
| `venia-concept`                        | **14.5.0***    |
| `venia-ui`                             | **11.7.2***    |
| `magento2-pwa`                         | **0.10.3***    |
| `magento2-pwa-commerce`                | 0.1.5          |
| `magento-venia-sample-data-modules`    | 0.0.6          |
| `magento-venia-sample-data-modules-ee` | 0.0.6          |
| `magento2-upward-connector`            | **2.1.6***     |
| `upward-php`                           | 2.1.4          |
| `pwa-live-search`                      | 1.0.0          |

[4597]: https://github.com/magento/pwa-studio/pull/4597
[4586]: https://github.com/magento/pwa-studio/pull/4586
[4574]: https://github.com/magento/pwa-studio/pull/4574
[4552]: https://github.com/magento/pwa-studio/pull/4552
[4587]: https://github.com/magento/pwa-studio/pull/4587
[4471]: https://github.com/magento/pwa-studio/pull/4471
[4589]: https://github.com/magento/pwa-studio/pull/4589
[4588]: https://github.com/magento/pwa-studio/pull/4588
[29]: https://github.com/magento-commerce/magento2-upward-connector/pull/29
[73]: https://github.com/magento-commerce/magento2-pwa/pull/73/
[4583]: https://github.com/magento/pwa-studio/pull/4583
[4576]: https://github.com/magento/pwa-studio/pull/4576
[4579]: https://github.com/magento/pwa-studio/pull/4579

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
