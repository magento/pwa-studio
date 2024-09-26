# PWA Studio Release 14.1.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.1.0_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 14.1.0 release of PWA Studio provides compatibility with PREX extension and Upgradation from node 14 to 18.


## Additional fixes

-  Story: [4319][] — Get Minimum Password Length from configuration.
-  Story: [4314][] — Header location should set to correct endpoint in case of 301|302.
-  Bug: [4316][] — DevContainer > Node 14 to 18 LTS is updated in dev container
-  Bug: [4303][] — Props error on Checkout page
-  Bug: [4260][] — Change user time to logout
-  Bug: [4277][] — PDP breadcrumbs only show one level of product category
-  Bug: [4280][] — Login issue with PWA 14.0
-  Bug: [4273][] — PWA Store View Not Functioning for Taiwan Store View with Language Locale 'zh_Hant_TW'
-  Bug: [59][] — GraphQL with PWA Non-default Sortable attribute fails
-  Bug: [4300][] — Update magento-compatibility.js to indicate all dependencies and just not magento
-  Bug: [4309][] —  Extending Peregrine Talons for Custom Applications
-  Bug: [4305][] — PWA Studio URL redirect not working
-  Bug: [4117][] — Update README.md with PWA Studio XD Kit
-  Bug: [4301][] — Language translating giving errors


## 14.1.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 14.1.0 release of these pages on desktop and mobile devices.

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

Use the steps outlined in this section to update your [scaffolded project][] from 14.0.1 to 14.1.0
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 14.0.1. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 14.0.0.

**NOTE:**
Your project may not depend on some packages listed in this table.

**[UPDATE THIS TABLE WITH THE LATEST VERSIONS OF EACH PACKAGE]**

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | 1.3.3    |
| `create-pwa`                           | 2.4.6          |
| `experience-platform-connector`        | **1.0.8***     |
| `upward-security-headers`              | **1.0.17***    |
| `venia-sample-backends`                | 0.0.11   |
| `venia-sample-eventing`                | **0.0.9***     |
| `venia-sample-language-packs`          | **0.0.17***    |
| `venia-sample-payments-checkmo`        | **0.0.15***    |
| `pagebuilder`                          | **9.3.2***     |
| `peregrine`                            | **14.4.1***    |
| `pwa-buildpack`                        | 11.5.3         |
| `pwa-theme-venia`                      | 2.4.0          |
| `upward-js`                            | 5.4.2          |
| `upward-spec`                          | 5.3.1          |
| `venia-concept`                        | **14.1.0***    |
| `venia-ui`                             | **11.5.0***    |
| `magento2-pwa`                         | **0.8.2***         |
| `magento2-pwa-commerce`                | 0.0.4          |
| `magento-venia-sample-data-modules`    | 0.0.5          |
| `magento-venia-sample-data-modules-ee` | 0.0.4          |
| `magento2-upward-connector`            | 2.0.4          |
| `upward-php`                           | 2.0.3          |

[4319]: https://github.com/magento/pwa-studio/pull/4319
[4314]: https://github.com/magento/pwa-studio/pull/4314
[4316]: https://github.com/magento/pwa-studio/pull/4316
[4303]: https://github.com/magento/pwa-studio/pull/4303
[4260]: https://github.com/magento/pwa-studio/pull/4260
[57]: https://github.com/magento-commerce/magento2-pwa/pull/57
[4277]: https://github.com/magento/pwa-studio/pull/4277
[4280]: https://github.com/magento/pwa-studio/pull/4280
[4273]: https://github.com/magento/pwa-studio/pull/4273
[59]: https://github.com/magento-commerce/magento2-pwa/pull/59
[4300]: https://github.com/magento/pwa-studio/pull/4300
[4309]: https://github.com/magento/pwa-studio/pull/4309
[4305]: https://github.com/magento/pwa-studio/pull/4305
[4117]: https://github.com/magento/pwa-studio/pull/4117
[4301]: https://github.com/magento/pwa-studio/pull/4301

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases

