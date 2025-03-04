<<<<<<< HEAD
# PWA Studio Release 14.2.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.2.0_
=======
# PWA Studio Release 14.1.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 14.1.0_
>>>>>>> 1c445d3e5 (adding release 14.1.0 change.log md)
_For older release notes, see_ [PWA Studio releases][].

## Highlights

<<<<<<< HEAD
PHP 8.4 support — PWA Studio now supports PHP 8.4. GitHub PRs: [62], [7], [29], [6], [25], [12]

The 14.2.0 release of PWA Studio provides compatibility with PREX extension and Upgradation from node 14 to 18.
=======
The 14.1.0 release of PWA Studio provides compatibility with PREX extension and Upgradation from node 14 to 18.
>>>>>>> 1c445d3e5 (adding release 14.1.0 change.log md)


## Additional fixes

<<<<<<< HEAD
-  Story: [4385][] — Added payment method for "Cash on Delivery" compatibiility into pwa-studio
-  Story: [4374][] — DOM Text Interpreted As HTML in PWA Code
-  Story: [4340][] — Pwa-studio Dependency Updates
-  Story: [4386][] — Implemented Price slider Filter with tailwind css 
-  Bug: [4395][] — Fixed error while creating User from Sign-in page which appeares post logout
-  Bug: [4346][] — Fixed account email confirmation flow and Added code to display error message from grapqhl response in form
-  Bug: [4362][] — Rolled back necessary changes of Tailwind
-  Bug: [4353][] — New theme creation - tailwind preset issues
-  Bug: [4318][] — Fixed issue of system is getting crashed when login / create user on Home page or Order Success page in case of translated language other then English
-  Bug: [4344][] — fixed issue of unable to see the Default Thumbnail for newly created product in PLP and PDP
-  Bug: [4354][] — Fixed Shipping address error when login
-  Bug: [4318][] — Fixed issue of system is getting crashed when selecting add to cart in case of translated language
-  Bug: [4357][] — Upward pwa forwarding BOT request to backend
-  Bug: [4403][] — Removing code since creating problem while yarn build in local when added this extension to package.json
however packages is published on NPM so will resolve in next release
-  Bug: [4342][] — Resolved error when getting thumbnails on order row for deleted products
-  Bug: [4339][] — able to see appropriate css variable on front end
-  Bug: [4363][] —  Fixed system is thorwing Error while signin from shipping address page
-  Bug: [4341][] — Order confirmation page persists through page refreshes when authenticated also navigates to home page on refresh for guest users
-  Bug: [4413][] — fixed unable to proceed checkout on iOS or Android Device post product added to cart
-  Bug: [4424][] — Unable to place order in Mobile screen as well as not able to filter or sort in PLP
=======
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
>>>>>>> 1c445d3e5 (adding release 14.1.0 change.log md)

## 14.2.0 Lighthouse scores

<<<<<<< HEAD
With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 14.2.0 release of these pages on desktop and mobile devices.
=======
## 14.1.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 14.1.0 release of these pages on desktop and mobile devices.
>>>>>>> 1c445d3e5 (adding release 14.1.0 change.log md)

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

<<<<<<< HEAD
Use the steps outlined in this section to update your [scaffolded project][] from 14.1.0 to 14.2.0
=======
Use the steps outlined in this section to update your [scaffolded project][] from 14.0.1 to 14.1.0
>>>>>>> 1c445d3e5 (adding release 14.1.0 change.log md)
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Updated package dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 14.2.0. The **bolded** versions with an asterisk (*) are the packages that were updated from PWA Studio 14.1.0.

**NOTE:**
Your project may not depend on some packages listed in this table.

**[UPDATE THIS TABLE WITH THE LATEST VERSIONS OF EACH PACKAGE]**

| Package                                | Latest version |
|----------------------------------------|----------------|
<<<<<<< HEAD
| `babel-preset-peregrine`               | 1.3.3          |
| `create-pwa`                           | **2.5.6***     |
| `experience-platform-connector`        | **1.0.9***     |
| `upward-security-headers`              | 1.0.17         |
| `venia-sample-backends`                | **0.0.12***    |
| `venia-sample-eventing`                | **0.0.10***    |
| `venia-sample-language-packs`          | **0.0.18***    |
| `venia-sample-payments-checkmo`        | **0.0.16***    |
| `venia-sample-payments-cashondelivery` | 0.0.1          |
| `pagebuilder`                          | **9.3.3***     |
| `peregrine`                            | **14.5.1***    |
| `pwa-buildpack`                        | **11.5.4 ***   |
| `pwa-theme-venia`                      | 2.4.0          |
| `upward-js`                            | 5.4.2          |
| `upward-spec`                          | 5.3.1          |
| `venia-concept`                        | **14.2.0***    |
| `venia-ui`                             | **11.6.0***    |
| `magento2-pwa`                         | **0.9.2***     |
| `magento2-pwa-commerce`                | **0.1.4***     |
| `magento-venia-sample-data-modules`    | **0.0.6***     |
| `magento-venia-sample-data-modules-ee` | **0.0.5***     |
| `magento2-upward-connector`            | **2.0.5***     |
| `upward-php`                           | **2.0.4***     |

[4395]: https://github.com/magento/pwa-studio/pull/4395
[4385]: https://github.com/magento/pwa-studio/pull/4385
[62]:   https://github.com/magento-commerce/magento2-pwa/pull/62
[7]:    https://github.com/magento-commerce/magento2-pwa-commerce/pull/7
[29]:   https://github.com/magento-commerce/venia-sample-data-modules/pull/29
[6]:    https://github.com/magento-commerce/venia-sample-data-modules-ee/pull/6
[25]:   https://github.com/magento-commerce/magento2-upward-connector/pull/25
[12]:   https://github.com/magento-commerce/upward-php/pull/12
[4346]: https://github.com/magento/pwa-studio/pull/4346
[4362]: https://github.com/magento/pwa-studio/pull/4362
[4353]: https://github.com/magento/pwa-studio/pull/4353/
[4374]: https://github.com/magento/pwa-studio/pull/4374
[4318]: https://github.com/magento/pwa-studio/pull/4318
[4340]: https://github.com/magento/pwa-studio/pull/4340
[4344]: https://github.com/magento/pwa-studio/pull/4344
[4354]: https://github.com/magento/pwa-studio/pull/4354
[4357]: https://github.com/magento/pwa-studio/pull/4357
[4386]: https://github.com/magento/pwa-studio/pull/4386
[4403]: https://github.com/magento/pwa-studio/pull/4403
[4342]: https://github.com/magento/pwa-studio/pull/4342
[4339]: https://github.com/magento/pwa-studio/pull/4339
[4363]: https://github.com/magento/pwa-studio/pull/4363
[4341]: https://github.com/magento/pwa-studio/pull/4341
[4413]: https://github.com/magento/pwa-studio/pull/4413
[4424]: https://github.com/magento/pwa-studio/pull/4424

=======
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
>>>>>>> 1c445d3e5 (adding release 14.1.0 change.log md)

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
