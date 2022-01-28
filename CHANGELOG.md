# Release 12.2.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.2.0_
_For older release notes, see_ [PWA Studio releases][].

## New Features

- **Updated to node 14** - 
- **New Venia default pages** - Venia now ships with the following default pages enabled:

    - Contact us
    - About us
    - Customer Support
    - Newsletter subscription


## Summary of all changes

| Type  |Description                                                                                                                             |GitHub PR             |
| :---- | :-------------------------------------------------------------------------------------------------------------------------------------- | :-------------------- |
| Story | \[Docs] Shimmer and UPWARD Inlining                                                                                                     | [3548][]              |
| Story | Add Cypress test coverage: Venia Filters, Search, Sort/Pagination                                                                       | [3519][][files][]     |
| Story | Add Cypress test coverage: VeniaRemoveItemFromMiniCart                                                                                  | [3508][]              |
| Story | Add Cypress test coverage: VeniaGuestIsAbleToAccessCategories.xml                                                                       | [3507][]              |
| Story | Add Cypress test coverage: VeniaCartPage\*                                                                                              | [3509][][34][]        |
| Story | Add Cypress test coverage: VeniaCartPageGuestCheckoutRegionWithCC                                                                       | [3505][][31][]        |
| Story | Add Cypress test coverage: VeniaCartPageGuestCheckout                                                                                   | [3504][][29][]        |
| Story | Update ConfigurableProductOptions GraphQL field from id to uid                                                                          | [3588][]              |
| Story | Update ProductInterface GraphQL field from id to uid                                                                                    | [3580][]              |
| Story | Update Customer.id GraphQL field                                                                                                        | [3594][]              |
| Story | Update sample data on Venia Home Page                                                                                                   | [9][]                 |
| Story | \[Issue] Add newsletter in footer                                                                                                       | [3486][]              |
| Story | GQL returns parameters(metadata) that define custom attributes of a product product - specifically Select input                         | [3][]                 |
| Story | GQL returns product-specific values of custom product attribute (Select input)                                                          | [9][]                 |
| Story | GQL support for the reCaptcha API                                                                                                       | [7][]                 |
| Story | Configuration Validation for reCaptcha v2                                                                                               | [8][]                 |
| Story | Streamline Cypress tests and create documentation                                                                                       | [3576][]              |
| Story | Update StoreConfig fields                                                                                                               | [3616][]              |
| Story | Update StoreConfig.id GraphQL field to store_code                                                                                       | [3593][]              |
| Story | Update CategoryTree.id GraphQL field to uid                                                                                             | [3598][]              |
| Story | Update category GraphQL query to categories query                                                                                       | [3577][]              |
| Story | Update urlResolver GraphQL usages to route                                                                                              | [3589][]              |
| Story | Update SelectedConfigurableOption GraphQL fields                                                                                        | [3601][]              |
| Story | Update CartItemInterface GraphQL field from id to uid                                                                                   | [3597][]              |
| Story | Update ProductInterface.type_id GraphQL field to use \_\_typename                                                                       | [3586][]              |
| Story | Added fade-in-out transition to the colour swatch checkmark                                                                             | [3526][]              |
| Story | UPWARD JS Computed resolver                                                                                                             | [3533][]              |
| Story | Add Cypress test coverage: VeniaCartPageEditCardAndCheckout                                                                             | [3525][][36][]        |
| Story | Add Cypress test coverage: VeniaAnchorLinks                                                                                             | [3518][][37][]        |
| Story | Add Cypress test coverage: RegisteredUserCartPageCheckout                                                                               | [3500][][27][]        |
| Story | Upgrade Apollo Client to 3.4.0                                                                                                          | [3491][]              |
| Story | About Us                                                                                                                                | [3483][][11][]        |
| Story | Customer Service                                                                                                                        | [3465][][1][]         |
| Story | Newsletter Subscription                                                                                                                 | [3521][]              |
| Story | Contact Us Block                                                                                                                        | [3544][][13][]        |
| Story | Contact Us                                                                                                                              | [3538][]              |
| Story | Guest Checkout: check if email is associated with the account                                                                           | [3529][]              |
| Story | Feature: Add ability to deploy Luma and Venia on single cloud env                                                                       | [11][]                |
| Story | Add cypress test for Mini cart                                                                                                          | [3559][]              |
| Story | Archive MFTF Repo                                                                                                                       | [39][]                |
| Story | Homepage unification for CE and EE                                                                                                      | [3564][]              |
| Story | Improve Version banner                                                                                                                  | [3555][]              |
| Story | Upgrade Node 14 and Scaffold Node 16                                                                                                    | [3552][][101][]       |
| Story | Fail build when @magento/pwa metapackage is not installed                                                                               | [3561][]              |
| Story | Filtering Product by the custom product attribute with input type select                                                                | [15][]                |
| Story | Do not show Ratings                                                                                                                     | [3654][]              |
| Story | Viewing product attribute value in PDP                                                                                                  | [3624][][14][]        |
| Story | Sorting product listing by custom attribute                                                                                             | [3619][][][]          |
| Story | \[GraphQL] Sort products without custom attribute to end                                                                                | [18][]                |
| Bug   | 404 routes cause error page                                                                                                             | [3542][]              |
| Bug   | Scaffold project > yarn build  fails on develop.                                                                                        | [3551][]              |
| Bug   | storybook command failing                                                                                                               | [3567][]              |
| Bug   | Minicart missing quantity while switching views                                                                                         | [3571][]              |
| Bug   | Order history data not being cleared from cache on logout                                                                               | [3520][]              |
| Bug   | Pagebuilder image content-type: mobile image is visible on desktop                                                                      | [3515][]              |
| Bug   | Pagebuilder links force browser to load full page                                                                                       | [3524][]              |
| Bug   | Add to Cart on category page for non-default store ends up in 404 page if store view level unique catalog product suffixes are enabled. | [3553][]              |
| Bug   | Category page fails to load intermittently when there is Apollo related console warning.                                                | [3575][]              |
| Bug   | Dependency on Magento was sneaked in as part of the Computed Resolver work                                                              | [16][][6][]           |
| Bug   | \[bug]: When clicking a submenu in the mega the submenu won't close                                                                     | [3599][]              |
| Bug   | Fix console warning for currency                                                                                                        | [3622][]              |
| Bug   | Remove server chunk generation from webpack                                                                                             | [3608][]              |
| Bug   | \[Issue] Improve Gallery/AddToCartButton.js                                                                                             | [3573][]              |
| Bug   | \[bug]: Breadcrumbs 'Shop' link redirects to '/shopnull'                                                                                | [3603][]              |
| Bug   | Multiple Wishlist cypress integration test failing on develop because of browser console error                                          | No PR                 |
| Bug   | Newsletter form displays two errors                                                                                                     | [3584][]              |
| Bug   | Home page tabbing leads to page transition                                                                                              | [3625][]              |
| Bug   | Browser Reload on any Category load all products from default category                                                                  | [3655][][18][]        |
| Bug   | Unable to install venia sample data meta package on Cloud  env                                                                          | [16][]                |
| Bug   | \[bug]: Duplicate Styles                                                                                                                | [files][]             |
| Bug   | Build fails in scaffolded project created via npm repo                                                                                  | [3664][]              |
| Bug   | Mini cart remaining product gets disabled if user has 2 or more products and deletes first (top) product                                | [3665][]              |

## Metapackage introduction and updates

As mentioned above, we not only introduced metapackages in this release, we used them! Our fix for the cart rendering issue ([3447][]) required new GraphQL fields that we added to the metapackages. These new fields require you to install one or both of our metapackages into your PWA apps (depending on your backend target). If you missed the links provided above, here they are again:

**For Open Source backends**: Install the [PWA Magento Open Source metapackage][].

**For Adobe Commerce backends**: Install the [PWA Adobe Commerce metapackage][].

## Documentation updates

-  **Metapackage Installation**: Added instructions for installing our new metapackages for both local and cloud-based environments. The instructions have been added to the READMEs of the Open Source and Commerce repos: [PWA Magento Open Source metapackage][] and [PWA Adobe Commerce metapackage][].

## Known Issues

-  Safari (macOS version) does not show toast messages or indicators when Venia switches between online and offline. This is an issue with Safari, not Venia. Safari always reports `true` for `navigator.onLine` — even when offline. We have submitted this issue to Apple. If you have an Apple account, you can search for the issue using this Feedback ID: FB9802994.

## Test Updates

-  [3460][] — Added Docker parallelization for Cypress testing to cut testing times by 50%. When run synchronously, the whole suite of tests took about 30 minutes. Now it takes 13–15 minutes.

-  [3506][] - Fixed outdated snapshots for failing Page Builder tests on the `develop` branch. The tests started failing when the Newsletter form was added to the footer.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.0.0 to 12.1.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://magento.github.io/pwa-studio/tutorials/pwa-studio-fundamentals/project-setup/
[upgrading versions]: https://magento.github.io/pwa-studio/technologies/upgrading-versions/

### Add the new metapackages to your project

As noted above, you need to add one or both of our new metapackages to your projects. Use these instructions:

-  **For Open Source backends**: Install the [PWA Magento Open Source metapackage][].

-  **For Adobe Commerce backends**: Install the [PWA Adobe Commerce metapackage][].

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.1.0.
Versions that are in **bold** indicate a version change for this release.

**Note:**
Your project may not depend on some of the packages listed in this table.

| Package                               | Latest version |
| ------------------------------------- | -------------- |
| `babel-preset-peregrine`              | 1.1.0          |
| **_`create-pwa`_**                    | _**2.0.1**_    |
| **_`upward-security-headers`_**       | _**1.0.5**_    |
| **_`venia-adobe-data-layer`_**        | _**1.0.2**_    |
| `venia-sample-backends`               | 0.0.4          |
| **_`venia-sample-language-packs`_**   | _**0.0.5**_    |
| **_`venia-sample-payments-checkmo`_** | _**0.0.3**_    |
| **_`pagebuilder`_**                   | _**7.0.1**_    |
| **_`peregrine`_**                     | _**12.1.0**_   |
| `pwa-buildpack`                       | 11.0.0         |
| **_`pwa-theme-venia`_**               | _**1.1.0**_    |
| `upward-js`                           | 5.2.0          |
| `upward-spec`                         | 5.1.0          |
| **_`venia-concept`_**                 | _**12.1.0**_   |
| **_`venia-ui`_**                      | _**9.1.0**_    |
| `magento2-upward-connector`           | 1.3.0          |
| `upward-php`                          | 1.2.0          |


[3548]: https://github.com/magento/pwa-studio/pull/3548
[3519]: https://github.com/magento/pwa-studio/pull/3519
[files]: https://github.com/magento-commerce/pwa-tests/pull/35/files
[3508]: https://github.com/magento/pwa-studio/pull/3508
[3507]: https://github.com/magento/pwa-studio/pull/3507
[3509]: https://github.com/magento/pwa-studio/pull/3509
[34]: https://github.com/magento-commerce/pwa-tests/pull/34
[3505]: https://github.com/magento/pwa-studio/pull/3505
[31]: https://github.com/magento-commerce/pwa-tests/pull/31
[3504]: https://github.com/magento/pwa-studio/pull/3504
[29]: https://github.com/magento-commerce/pwa-tests/pull/29
[3588]: https://github.com/magento/pwa-studio/pull/3588
[3580]: https://github.com/magento/pwa-studio/pull/3580
[3594]: https://github.com/magento/pwa-studio/pull/3594
[9]: https://github.com/magento-commerce/venia-sample-data-modules/pull/9
[3486]: https://github.com/magento/pwa-studio/pull/3486
[3]: https://github.com/magento-commerce/magento2-pwa/pull/3
[9]: https://github.com/magento-commerce/magento2-pwa/pull/9
[7]: https://github.com/magento-commerce/magento2-pwa/pull/7
[8]: https://github.com/magento-commerce/magento2-pwa/pull/8
[3576]: https://github.com/magento/pwa-studio/pull/3576
[3616]: https://github.com/magento/pwa-studio/pull/3616
[3593]: https://github.com/magento/pwa-studio/pull/3593
[3598]: https://github.com/magento/pwa-studio/pull/3598
[3577]: https://github.com/magento/pwa-studio/pull/3577
[3589]: https://github.com/magento/pwa-studio/pull/3589
[3601]: https://github.com/magento/pwa-studio/pull/3601
[3597]: https://github.com/magento/pwa-studio/pull/3597
[3586]: https://github.com/magento/pwa-studio/pull/3586
[3526]: https://github.com/magento/pwa-studio/pull/3526
[3533]: https://github.com/magento/pwa-studio/pull/3533
[3525]: https://github.com/magento/pwa-studio/pull/3525
[36]: https://github.com/magento-commerce/pwa-tests/pull/36
[3518]: https://github.com/magento/pwa-studio/pull/3518
[37]: https://github.com/magento-commerce/pwa-tests/pull/37
[3500]: https://github.com/magento/pwa-studio/pull/3500
[27]: https://github.com/magento-commerce/pwa-tests/pull/27
[3491]: https://github.com/magento/pwa-studio/pull/3491
[3483]: https://github.com/magento/pwa-studio/pull/3483
[11]: https://github.com/magento-commerce/venia-sample-data-modules/pull/11
[3465]: https://github.com/magento/pwa-studio/pull/3465
[1]: https://github.com/magento-untitled-geese/venia-sample-data-modules/pull/1
[3521]: https://github.com/magento/pwa-studio/pull/3521
[3544]: https://github.com/magento/pwa-studio/pull/3544
[13]: https://github.com/magento-commerce/venia-sample-data-modules/pull/13
[3538]: https://github.com/magento/pwa-studio/pull/3538
[3529]: https://github.com/magento/pwa-studio/pull/3529
[11]: https://github.com/magento-commerce/magento2-upward-connector/pull/11
[3559]: https://github.com/magento/pwa-studio/pull/3559
[39]: https://github.com/magento-commerce/pwa-tests/pull/39
[3564]: https://github.com/magento/pwa-studio/pull/3564
[3555]: https://github.com/magento/pwa-studio/pull/3555
[3552]: https://github.com/magento/pwa-studio/pull/3552
[101]: https://github.com/magento-commerce/pwa-studio-cicd/pull/101
[3561]: https://github.com/magento/pwa-studio/pull/3561
[15]: https://github.com/magento-commerce/magento2-pwa/pull/15
[3654]: https://github.com/magento/pwa-studio/pull/3654
[3624]: https://github.com/magento/pwa-studio/pull/3624
[14]: https://github.com/magento-commerce/magento2-pwa/pull/14
[3619]: https://github.com/magento/pwa-studio/pull/3619
[]: <>
[18]: https://github.com/magento-commerce/magento2-pwa/pull/18
[3542]: https://github.com/magento/pwa-studio/pull/3542
[3551]: https://github.com/magento/pwa-studio/pull/3551
[3567]: https://github.com/magento/pwa-studio/pull/3567
[3571]: https://github.com/magento/pwa-studio/pull/3571
[3520]: https://github.com/magento/pwa-studio/pull/3520
[3515]: https://github.com/magento/pwa-studio/pull/3515
[3524]: https://github.com/magento/pwa-studio/pull/3524
[3553]: https://github.com/magento/pwa-studio/pull/3553
[3575]: https://github.com/magento/pwa-studio/pull/3575
[16]: https://github.com/magento-commerce/magento2-upward-connector/pull/16
[6]: https://github.com/magento-commerce/upward-php/pull/6
[3599]: https://github.com/magento/pwa-studio/pull/3599
[3622]: https://github.com/magento/pwa-studio/pull/3622
[3608]: https://github.com/magento/pwa-studio/pull/3608
[3573]: https://github.com/magento/pwa-studio/pull/3573
[3603]: https://github.com/magento/pwa-studio/pull/3603

[3584]: https://github.com/magento/pwa-studio/pull/3584
[3625]: https://github.com/magento/pwa-studio/pull/3625
[3655]: https://github.com/magento/pwa-studio/pull/3655
[18]: https://github.com/magento-commerce/magento2-upward-connector/pull/18
[16]: https://github.com/magento-commerce/venia-sample-data-modules/pull/16
[files]: https://github.com/magento/pwa-studio/pull/3658/files
[3664]: https://github.com/magento/pwa-studio/pull/3664
[3665]: https://github.com/magento/pwa-studio/pull/3665
[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
