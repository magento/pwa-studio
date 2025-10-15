# PWA Studio Release 14.4.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.4.0_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 14.4.0 release of PWA Studio provides multiple bug fixes and improvements to the cart functionality.

## Additional fixes

-  Story:[4545][] — The Add to Cart button has been enhanced
-  Bug:[4562][] — The wishlist pagination issue preventing more than 2 pages from displaying has been resolved
-  Bug:[4548][] — The CSP nonce error for inline scripts has been resolved
-  Bug:[4541][] — Videos now render properly on the frontend.
-  Bug:[310][] — Corrected typos and grammatical errors in all PWA developer documentation.
-  Bug:[4505][] — Fixed the Select component to use Peregrine's useInformedFieldStateWrapper.
-  Bug:[4469][] — Fixed a Yarn invariant violation caused by packages/pagebuilder requesting a different version of react-tabs.
-  Bug:[4540][] — Fixed an issue where the cart became empty when updating configurable products.
-  Bug:[4542][] — Fixed wishlist pagination issue.
-  Bug:[4535][] — Removed package-lock.json.
-  Bug:[4549][] — Resolved the upwardPath not found error.
-  Bug:[4543][] — Resolved an infinite loop query in GetWishlistItemsForLocalField.
-  Bug:[4550][] — Fixed invalid auth middleware clearTimeout implementation.
-  Bug:[4544][] — Fixed an issue where resetting search filters caused unfiltered search results.

## 14.4.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits on four Venia page types, each representing a different level of complexity.
Shown below are the Lighthouse scores for the 14.4.0 release of these pages on desktop and mobile devices.
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

Use the steps outlined in this section to update your [scaffolded project][] from 14.3.1 to 14.4.0
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 14.4.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 14.3.1.

**NOTE:**
Your project may not depend on some packages listed in this table.

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | 1.3.3          |
| `create-pwa`                           | **2.5.8***     |
| `experience-platform-connector`        | **1.0.11***    |
| `upward-security-headers`              | **1.0.19***    |
| `venia-sample-backends`                | **0.0.13***    |
| `venia-sample-eventing`                | **0.0.12***    |
| `venia-sample-language-packs`          | **0.0.20***    |
| `venia-sample-payments-checkmo`        | **0.0.18***    |
| `venia-sample-payments-cashondelivery` | **0.0.3***     |
| `venia-pwa-live-search`                | **1.0.1***     |
| `venia-product-recommendations`        | 1.0.2          |
| `plugin-braintree-three-d-secure`      | 1.0.1          |
| `pagebuilder`                          | **9.3.6***     |
| `peregrine`                            | **15.6.2***    |
| `pwa-buildpack`                        | **11.5.5***    |
| `pwa-theme-venia`                      | 2.4.0          |
| `upward-js`                            | **5.4.3***     |
| `upward-spec`                          | 5.3.1          |
| `venia-concept`                        | **14.4.0***    |
| `venia-ui`                             | **11.7.1***    |
| `magento2-pwa`                         | 0.10.2         |
| `magento2-pwa-commerce`                | 0.1.5          |
| `magento-venia-sample-data-modules`    | 0.0.6          |
| `magento-venia-sample-data-modules-ee` | 0.0.6          |
| `magento2-upward-connector`            | 2.1.5          |
| `upward-php`                           | 2.1.4          |
| `pwa-live-search`                      | 1.0.0          |

[4562]: https://github.com/magento/pwa-studio/pull/4562
[4548]: https://github.com/magento/pwa-studio/pull/4548
[4545]: https://github.com/magento/pwa-studio/pull/4545
[4541]: https://github.com/magento/pwa-studio/pull/4541
[310]: https://github.com/AdobeDocs/commerce-pwa-studio/pull/310/
[4505]: https://github.com/magento/pwa-studio/pull/4505
[4469]: https://github.com/magento/pwa-studio/pull/4469
[4540]: https://github.com/magento/pwa-studio/pull/4540
[4542]: https://github.com/magento/pwa-studio/pull/4542
[4535]: https://github.com/magento/pwa-studio/pull/4535
[4549]: https://github.com/magento/pwa-studio/pull/4549
[4543]: https://github.com/magento/pwa-studio/pull/4543
[4550]: https://github.com/magento/pwa-studio/pull/4550
[4544]: https://github.com/magento/pwa-studio/pull/4544

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
