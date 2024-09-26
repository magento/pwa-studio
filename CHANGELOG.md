# PWA Studio Release 14.0.1
# Tsting PR line

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.0.1_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 14.0.1 release of PWA Studio provides compatibility with PREX extension and Upgradation from node 14 to 18.


## Additional fixes

-  Story: [4283][] — OOTB Commerce PWA Venia and PREX compatibility.
-  Story: [4279][] — upgrading node support >= 18 . Node 14 and 16 are stale, no more supported for security fixes.
-  Bug: [4269][] — Storefront needs to automatically update the newly added/changes translations


## 14.0.1 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 14.0.1 release of these pages on desktop and mobile devices.

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

Use the steps outlined in this section to update your [scaffolded project][] from 14.0.0 to 14.0.1.
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
| `babel-preset-peregrine`               | **1.3.3***     |
| `create-pwa`                           | 2.4.6          |
| `experience-platform-connector`        | **1.0.7***     |
| `upward-security-headers`              | **1.0.16***    |
| `venia-sample-backends`                | **0.0.11***    |
| `venia-sample-eventing`                | **0.0.8***     |
| `venia-sample-language-packs`          | **0.0.16***    |
| `venia-sample-payments-checkmo`        | **0.0.14***    |
| `pagebuilder`                          | **9.3.1***     |
| `peregrine`                            | **14.3.1***    |
| `pwa-buildpack`                        | **11.5.3***    |
| `pwa-theme-venia`                      | 2.4.0          |
| `upward-js`                            | **5.4.2***     |
| `upward-spec`                          | **5.3.1***     |
| `venia-concept`                        | **14.0.1***    |
| `venia-ui`                             | **11.4.0***    |
| `magento2-pwa`                         | 0.7.2          |
| `magento2-pwa-commerce`                | 0.0.4          |
| `magento-venia-sample-data-modules`    | 0.0.5          |
| `magento-venia-sample-data-modules-ee` | 0.0.4          |
| `magento2-upward-connector`            | 2.0.4          |
| `upward-php`                           | 2.0.3          |

[4283]: https://github.com/magento/pwa-studio/pull/4283
[4279]: https://github.com/magento/pwa-studio/pull/4279
[4269]: https://github.com/magento/pwa-studio/pull/4269

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
