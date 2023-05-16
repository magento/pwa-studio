# PWA Studio Release 13.1.0

**NOTE:**  
_This changelog only contains release notes for PWA Studio and Venia 13.1.0_  
_For older release notes, see_ [PWA Studio releases][].

## Highlights

- **PHP 8.2 support** — PWA Studio now supports PHP 8.2. GitHub PRs: [4][], [25][], [34][], [5][], [20][], [10][]
- **Payment method persists** — The chosen payment method now persists throughout the user's session. GitHub PR: [3969][]
- **Node 18 support** — PWA Studio now supports Node 18.0,0+. GitHub PR: [172][]

## Additional fixes

- Story: [36][] — Updated Zend libraries to respective laminas.
- Bug: [4028][] — Fixed support for Page Builder column-line content type
- Bug: [35][] — Fixed an issue that crashed the Categories page when applying a filter.
- Bug: [4053][] — Fixed an issue that prevented a filter from being applied to the text label.
- Bug: [4059][] — Fixed an issue where the URL was not updated properly in Page Builder.
- Bug: [4061][] — Fixed null-network requests that occurred when refreshing the Venia home page.
- Bug: [4066][] — Fixed fashion-size value to be read by screen readers.
- Bug: [4049][] —Fixed keyboard access for the Cancel button adjacent to the Create Account button.
- Bug: [4064][] — Fixed keyboard access to the Sign in button.
- Bug: [26][] — Fixed Venia sample data cloud deployment with PHP 8.2.
- Bug: [4052][] — Fixed an issue that caused the Additional Giftcard link to appear in the discounted section.

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
[4028]: https://github.com/magento/pwa-studio/pull/4028
[35]: https://github.com/magento-commerce/magento2-pwa/pull/35
[4053]: https://github.com/magento/pwa-studio/pull/4053
[172]: https://github.com/AdobeDocs/commerce-pwa-studio/pull/172
[4059]: https://github.com/magento/pwa-studio/pull/4059
[4061]: https://github.com/magento/pwa-studio/pull/4061
[4066]: https://github.com/magento/pwa-studio/pull/4066
[4049]: https://github.com/magento/pwa-studio/pull/4049
[4064]: https://github.com/magento/pwa-studio/pull/4064
[26]: https://github.com/magento-commerce/venia-sample-data-modules/pull/26
[4052]: https://github.com/magento/pwa-studio/pull/4052
[36]: https://github.com/magento-commerce/magento2-pwa/pull/36
[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
