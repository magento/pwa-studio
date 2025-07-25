# PWA Studio Release 14.3.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.3.0_
_For older release notes, see_ [PWA Studio releases][].

## Highlights

PHP 8.4 support — PWA Studio now supports PHP 8.4.

The 14.3.0 release of PWA Studio provides compatibility with PREX extension and Upgradation from node 18 to 20.


## Additional fixes

-  Story: [4463][] — Gomage/plugin braintree three d secure
-  Story: [4456][] — PWA multistore setup 
-  Story: [4458][] — Prex is compatible with PWA
-  Bug: [4454][] — Updated Docker changes to fix UI issue on PR link
-  Bug: [4384][] — Removed unused Option in Select
-  Bug: [27][] —   Made 3rd party vendor Mustache is compatible with PHP 8.4
-  Bug: [4472][] — Wishlist page if we click on product image or product link is now redirecting to PDP page.
-  Bug: [4466][] - Failing PR test cases has been fixed
-  Bug: [4506][] — Resolved internal server error in  Order History page when we click on order Search button when search field is empty
-  Bug: [4508][] — 	Post Scafhold all commands are failing in when scafholded using "yarn create @magento/pwa" command is resolved
-  Bug: [70][] — When we try to create account getting error is resolved


## 14.3.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 14.3.0 release of these pages on desktop and mobile devices.

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
|    Performance |     ![](images/score_23.svg)      |      ![](images/score_34.svg)       |      ![](images/score_63.svg)      |     ![](images/score_39.svg)      |
|  Accessibility |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
| Best Practices |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            SEO |     ![](images/score_100.svg)     |      ![](images/score_100.svg)      |     ![](images/score_100.svg)      |     ![](images/score_100.svg)     |
|            PWA |    ![](images/pwa_perfect.svg)    |    ![](images/pwa_imperfect.svg)    |   ![](images/pwa_imperfect.svg)    |    ![](images/pwa_perfect.svg)    |


## Known issue

When user create scaffolding project using command yarn create @magento/pwa, project gets created but throwing an error - "'dompurify' Module not found"
while running either of commands (yarn watch / yarn run storybook / yarn run build / yarn start) inside the created project.
Solution: To resolve this error add library 'dompurify' in the created project by running command 'yarn add dompurify' from the root of the project folder. Once the library is added in the project it will work as expected

When a user logs out, that user's local storage session persists. As a result, the cart ID from the logged out user is retrieved and given to the _guest user_ on the computer. This causes the following error when the guest user tries to check out: `An error has occurred. Please check the input and try again.` To resolve this issue, try disabling graphql session sharing as described in the GraphQL documentation on session cookies here: https://devdocs.magento.com/guides/v2.4/graphql/authorization-tokens.html#session-cookies.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 14.2.0 to 14.3.0
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 14.3.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 14.2.0.

**NOTE:**
Your project may not depend on some packages listed in this table.

**[UPDATE THIS TABLE WITH THE LATEST VERSIONS OF EACH PACKAGE]**

| Package                                | Latest version |
|----------------------------------------|----------------|
| `babel-preset-peregrine`               | 1.3.3          |
| `create-pwa`                           | **2.5.7***     |
| `experience-platform-connector`        | **1.0.10***    |
| `upward-security-headers`              | **1.0.18***    |
| `venia-sample-backends`                | 0.0.12         |
| `venia-sample-eventing`                | **0.0.11***    |
| `venia-sample-language-packs`          | **0.0.19***    |
| `venia-sample-payments-checkmo`        | **0.0.17***    |
| `venia-sample-payments-cashondelivery` | **0.0.2***     |
| `venia-product-recommendations`        | **1.0.2***     |
| `plugin-braintree-three-d-secure`      | **1.0.0***     |
| `pagebuilder`                          | **9.3.4***     |
| `peregrine`                            | **15.5.1***    |
| `pwa-buildpack`                        | 11.5.4         |
| `pwa-theme-venia`                      | 2.4.0          |
| `upward-js`                            | 5.4.2          |
| `upward-spec`                          | 5.3.1          |
| `venia-concept`                        | **14.3.0***    |
| `venia-ui`                             | **11.7.0***    |
| `magento2-pwa`                         | **0.10.2***    |
| `magento2-pwa-commerce`                | **0.1.5***     |
| `magento-venia-sample-data-modules`    | 0.0.6          |
| `magento-venia-sample-data-modules-ee` | **0.0.6***     |
| `magento2-upward-connector`            | **2.1.5***     |
| `upward-php`                           | **2.1.4***     |

[4454]: https://github.com/magento/pwa-studio/pull/4454
[4384]: https://github.com/magento/pwa-studio/pull/4384
[27]:   https://github.com/magento-commerce/magento2-upward-connector/pull/27
[4466]:  https://github.com/magento/pwa-studio/pull/4466
[4472]:  https://github.com/magento/pwa-studio/pull/4472
[4463]:  https://github.com/magento/pwa-studio/pull/4463
[4506]:  https://github.com/magento/pwa-studio/pull/4506
[4508]:  https://github.com/magento/pwa-studio/pull/4508
[70]:   https://github.com/magento-commerce/magento2-pwa/pull/70
[4456]: https://github.com/magento/pwa-studio/pull/4456
[4458]: https://github.com/magento/pwa-studio/pull/4458


[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
