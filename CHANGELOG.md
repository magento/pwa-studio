# PWA Studio Release 13.2.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 13.2.0_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 13.0 release of PWA Studio provides customers with many accessibility improvements for keyboard and screen-reader access, as well as several bug fixes. Full details are described below.

## Accessibility Updates

-  Story: [4092][] — Sign in > Forget password is working with keyboard Enter key press.
-  Story: [4100][] — Minicart > Buttons is working with keyboard Enter key press.
-  Story: [4120][] — Apply Gift Card > Button is working with keyboard Enter key.
-  Story: [4112][] — Enter Coupon Code > Button is working with keyboard Enter key press.
-  Story: [4094][] — Apply Gift Card > Link Check Balance button is working now with Enter key press.
-  Story: [4111][] — Estimate your Shipping > Button is working with keyboard Enter key press.
-  Story: [4104][] — The screen reader now reads the appropriate message as expected when a shopper clicks Return to  apply a gift card on the cart page without entering a gift card number.
-  Story: [4104][] — System was getting crashed with unexpected error when pressed Retrun button with invalid Gift card number but now fixed and working without any issue.

## Bug fixes

-  Bug: [4086][] — Updated to latest @adobe/magento-storefront-event-collector.
-  Bug: [4040][] — Added Dev Container config to improve developer experience.
-  Bug: [4103][] — Updated eventing system to stay compatible with latest AEP schema.
-  Bug: [4123][] — Edited the Magento2 Backend URL to working url.
-  Bug: [4121][] — The 'signout' event is now captured.
-  Bug: [4118][] — PWA Scaffolding Tool uses old version.
-  Bug: [4084][] — useLink operations empty object destructuring.
-  Bug: [4115][] — Selecting payment method causing graphql error.
-  Bug: [4083][] — No results when filtering a category with a composite attribute from layered navigation.
-  Bug: [4075][] — Venia header/layout broken in offline mode.
-  Bug: [4124][] — Region required validation is working in pwa according to option selected in Magento.
-  Bug: [4109][] — Url Rewrite to external URL does not work on PWA.
-  Bug: [4114][] — PWA shows 404 when having store code in URL.
-  Bug: [4102][] — When you click on Thumbnail, Add to cart works.
-  Bug: [4060][] — Search auto populate results not accessible with tab or up/down keys.

## 13.2.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 13.2.0 release of these pages on desktop and mobile devices.

### Desktop scores

|                |            Home Page            |          Product Category           |          Product Details           |          Search Results           |
|---------------:|:-------------------------------:|:-----------------------------------:|:----------------------------------:|:---------------------------------:|
|    **Desktop** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
|    Performance |    ![](images/score_88.svg)     |      ![](images/score_94.svg)       |      ![](images/score_63.svg)      |     ![](images/score_96.svg)      |
|  Accessibility |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
| Best Practices |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            SEO |    ![](images/score_100.svg)    |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            PWA |   ![](images/pwa_perfect.svg)   |     ![](images/pwa_perfect.svg)     |    ![](images/pwa_perfect.svg)     |    ![](images/pwa_perfect.svg)    |

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

Use the steps outlined in this section to update your [scaffolded project][] from 13.1.0 to 13.2.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 13.2.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 13.1.0.

**NOTE:**
Your project may not depend on some packages listed in this table.

**[UPDATE THIS TABLE WITH THE LATEST VERSIONS OF EACH PACKAGE]**

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | 1.2.2          |
| `create-pwa`                           | **2.4.5***     |
| `experience-platform-connector`        | **1.0.5***     |
| `upward-security-headers`              | **1.0.14***    |
| `venia-sample-backends`                | 0.0.10          |
| `venia-sample-eventing`                | **0.0.6***     |
| `venia-sample-language-packs`          | **0.0.14***    |
| `venia-sample-payments-checkmo`        | **0.0.12***    |
| `pagebuilder`                          | **8.2.0***     |
| `peregrine`                            | **13.1.1***    |
| `pwa-buildpack`                        | 11.4.2        |
| `pwa-theme-venia`                      | 1.4.0          |
| `upward-js`                            | 5.3.2          |
| `upward-spec`                          | 5.2.1          |
| `venia-concept`                        | **13.2.0***    |
| `venia-ui`                             | **10.2.0***    |
| `magento2-pwa`                         | 0.5.1          |
| `magento2-pwa-commerce`                | 0.0.3          |
| `magento-venia-sample-data-modules`    | 0.0.4         |
| `magento-venia-sample-data-modules-ee` | 0.0.3          |
| `magento2-upward-connector`            | 2.0.2         |
| `upward-php`                           | 2.0.2          |

[4092]: https://github.com/magento/pwa-studio/pull/4092
[4100]: https://github.com/magento/pwa-studio/pull/4100
[4086]: https://github.com/magento/pwa-studio/pull/4086
[4040]: https://github.com/magento/pwa-studio/pull/4040
[4103]: https://github.com/magento/pwa-studio/pull/4103
[4094]: https://github.com/magento/pwa-studio/pull/4094
[4120]: https://github.com/magento/pwa-studio/pull/4120
[4112]: https://github.com/magento/pwa-studio/pull/4112
[4111]: https://github.com/magento/pwa-studio/pull/4111
[4104]: https://github.com/magento/pwa-studio/pull/4104
[4123]: https://github.com/magento/pwa-studio/pull/4123
[134]: https://github.com/magento-commerce/pwa-studio-cicd/pull/134
[4121]: https://github.com/magento/pwa-studio/pull/4121
[4118]: https://github.com/magento/pwa-studio/pull/4118
[4084]: https://github.com/magento/pwa-studio/pull/4084
[4115]: https://github.com/magento/pwa-studio/pull/4115
[4083]: https://github.com/magento/pwa-studio/pull/4083
[4075]: https://github.com/magento/pwa-studio/pull/4075
[4124]: https://github.com/magento/pwa-studio/pull/4124
[4109]: https://github.com/magento/pwa-studio/pull/4109
[4114]: https://github.com/magento/pwa-studio/pull/4114
[4102]: https://github.com/magento/pwa-studio/pull/4102
[4060]: https://github.com/magento/pwa-studio/pull/4060

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
