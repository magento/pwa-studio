# PWA Studio Release 13.1.0

**NOTE:**  
_This changelog only contains release notes for PWA Studio and Venia 13.1.0_  
_For older release notes, see_ [PWA Studio releases][].

## Additions and improvements

- PWA Studio now supports PHP 8.2. GitHub PRs: [4][], [25][], [34][], [5][], [20][], [10][]
- The chosen payment method now persists throughout the user's session. GitHub PR: [3969][]

## 13.1.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 13.1.0 release of these pages on desktop and mobile devices.

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

## Known issues

- Event data is currently not being stored properly in the database. Our initial investigation concluded that this would affect all PWA Studio customers using Beacon eventing.

- When a user logs out, that user's local storage session persists. As a result, the cart ID from the logged out user is retrieved and given to the _guest user_ on the computer. This causes the following error when the guest user tries to check out: `An error has occurred. Please check the input and try again.` To resolve this issue, try disabling graphql session sharing as described in the GraphQL documentation on session cookies here: https://devdocs.magento.com/guides/v2.4/graphql/authorization-tokens.html#session-cookies.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 13.0.0 to 13.1.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 13.1.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 13.0.0.

**Note:**
Your project may not depend on some packages listed in this table.

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | 1.2.2          |
| `create-pwa`                           | **2.3.5***     |
| `experience-platform-connector`        | **1.0.4***     |
| `upward-security-headers`              | **1.0.13***    |
| `venia-sample-backends`                | 0.0.9          |
| `venia-sample-eventing`                | **0.0.5***     |
| `venia-sample-language-packs`          | **0.0.13***    |
| `venia-sample-payments-checkmo`        | **0.0.11***    |
| `pagebuilder`                          | **8.1.0***     |
| `peregrine`                            | **13.0.1***    |
| `pwa-buildpack`                        | 11.4.1         |
| `pwa-theme-venia`                      | 1.4.0          |
| `upward-js`                            | 5.3.2          |
| `upward-spec`                          | 5.2.1          |
| `venia-concept`                        | **13.1.0***    |
| `venia-ui`                             | **10.1.0***    |
| `magento2-pwa`                         | **0.5.0***          |
| `magento2-pwa-commerce`                | **0.0.3***          |
| `magento-venia-sample-data-modules`    | **0.0.4***          |
| `magento-venia-sample-data-modules-ee` | **0.0.3***          |
| `magento2-upward-connector`            | **2.0.2***          |
| `upward-php`                           | **2.0.2***          |

[4]: https://github.com/magento-commerce/venia-sample-data-modules-ee/pull/4
[25]: https://github.com/magento-commerce/venia-sample-data-modules/pull/25
[34]: https://github.com/magento-commerce/magento2-pwa/pull/34
[5]: https://github.com/magento-commerce/magento2-pwa-commerce/pull/5
[20]: https://github.com/magento-commerce/magento2-upward-connector/pull/20
[10]: https://github.com/magento-commerce/upward-php/pull/10
[3969]: https://github.com/magento/pwa-studio/pull/3969
[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
