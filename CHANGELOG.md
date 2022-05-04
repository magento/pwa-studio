# PWA Studio Release 12.4.0

**NOTE:**  
_This changelog only contains release notes for PWA Studio and Venia 12.4.0_  
_For older release notes, see_ [PWA Studio releases][].

## Highlights  

The main focus of PWA Studio 12.4 is additional support for working with both system attributes and custom product attributes. While previously, this could be done, results were difficult to parse, with little ability for sorting and filtering. Now, system and custom product attributes are returned in their own object within the GraphQL response, which can be sorted and filtered.

### Product attributes

- Products can now be sorted by the product attribute value on the product listing page. — [3761][]
- The Venia sample data has been updated to include product attributes. — [23][] 
- Product attribute values can now be used to search for products. — [3747][]

### Product Attributes on PDP

 
- The product detail page has dedicated slots for rendering product attributes values.
- The product detail page supports all content layout options available with Page Builder (full-width, full-bleed, contained).

## Other highlights and fixes

- It is now possible to build a project using an older version of PWA studio by appending the version number to the \`create\` command.
- Updated the Tailwind preset file in the Venia theme package to extend the base Tailwind configuration and add Venia-specific custom values. - [3686][]
- PWA Studio now supports CSS breakpoints set within PageBuilder components. — [3673][]
- The ProductQuantity component has been removed from the codebase as it is not used anymore. It has been replaced with the QuantityStepper component. — [3717][]
- Cypress tests have been added to check for offline mode on the Home, Category, Product, and Search pages. — [3710][]
- Magento Community Edition (CE) has been rebranded as "Magento Open Source" and the Enterprise Edition (EE) is now "Adobe Commerce". — [3697][]
- Currency is now set properly when changing the currency in a PageBuilder product collection. Previously, when changing currency from the header dropdown, prices in PageBuilder product collections were not getting updated. — [3720][]
- Video background with parallax enabled on Safari browser should now behave as intended. — [3661][]
- Restored TTL support in BrowserPersistence. — [3729][]
- Resolved static build failure issues for venia-sample-data-modules repository. — [21][]
- The \`product_url_suffix\` value is now properly passed. Previously, it would return \`null\`. — [3666][]
- Fixed a bug that would throw a Javascript error when clicking on a configurable product where an option has been disabled on the backend.  — [3740][]
- Replaced existing CSS values in UI components with equivalent Tailwind classes. - [3686][]

| Type  | Description                                                                                   | GitHub PR |
| :---- | :-------------------------------------------------------------------------------------------- | :-------- |
| Story | Add PageBuilder media query breakpoints support in PWA                                        | [3673][]  |
| Story | Make QuantityStepper @api and deprecate ProductQuantity                                       | [3717][]  |
| Story | \[Cypress] Add tests for offline mode                                                         | [3710][]  |
| Story | Update the Sample data with Product Attributes                                                | [23][]    |
| Story | Support new branding terms                                                                    | [3697][]  |
| Story | Filtering Product by the attribute value                                                      | [3747][]      |
| Story | View Product Attributes values on PDP - Text input, Multi-select, Boolean, Date               | [3761][]      |
| Bug   | \[bug]: Page builder product collection's price+currency is not updating on currency changes. | [3720][]  |
| Bug   | upward-php latest develop not compatible with php 7.4 on cloud pro.                           | [8][]     |
| Bug   | \[PB] Parallax video background is broken on Safari                                           | [3661][]  |
| Bug   | Regression fix disabled TTL support in BrowserPersistence                                     | [3729][]  |
| Bug   | Static build failures in magento-commerce/venia-sample-data-modules repo                      | [21][]    |
| Bug   | \[bug]: product_url_suffix cloud be return as null from backend                               | [3666][]  |
| Bug   | Disabled product throw an exception cannot read properties of undefined                       | [3740][]  |
| Bug   | Deprecated field which could return incorrect discounted price is no longer returned          | [3760][]  |
| Bug   | On mobile, the short description is now properly displayed below the image, rather than above.| [3808][]  |

## Documentation updates

- Updated the [GraphQL guide](https://devdocs.magento.com/guides/v2.4/graphql/interfaces/pwa-implementations.html) with latest changes to the magneto2-pwa module.
- Added instructions on how to build scaffolding with a [specific version](https://developer.adobe.com/commerce/pwa-studio/guides/packages/buildpack/scaffolding/) of PWA Studio.
- Added information about the [PWA Studio UI Kit for Adobe XD](https://developer.adobe.com/commerce/pwa-studio/guides/project/tools-libraries/)

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.3.0 to 12.4.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.4.0.

**Note:**
Your project may not depend on some of the packages listed in this table.

| Package                             | Latest version |
|-------------------------------------|----------------|
| `babel-preset-peregrine`            | **1.2.1**      |
| `create-pwa`                        | **2.3.0**      |
| `upward-security-headers`           | **1.0.8**      |
| `venia-adobe-data-layer`            | **1.0.5**      |
| `venia-sample-backends`             | **0.0.7**      |
| `venia-sample-language-packs`       | **0.0.8**      |
| `venia-sample-payments-checkmo`     | **0.0.6**      |
| `pagebuilder`                       | **7.3.0**      |
| `peregrine`                         | **12.4.0**     |
| `pwa-buildpack`                     | **11.3.0**     |
| `pwa-theme-venia`                   | **1.3.0**      |
| `upward-js`                         | **5.3.1**      |
| `upward-spec`                       | **5.2.1**      |
| `venia-concept`                     | **12.4.0**     |
| `venia-ui`                          | **9.4.0**      |
| `magento2-pwa`                      | **0.2.1**      |
| `magento2-pwa-commerce`             | **0.0.2**      |
| `magento-venia-sample-data-modules` | **0.0.3**      |
| `magento-venia-sample-data-modules-ee`| **0.0.2**    |
| `magento2-upward-connector`         | **2.0.1**      |
| `upward-php`                        | **2.0.1**      |

[PWA-2558]: https://jira.corp.magento.com/browse/PWA-2558  
[PWA-2707]: https://jira.corp.magento.com/browse/PWA-2707  
[PWA-1471]: https://jira.corp.magento.com/browse/PWA-1471   
[PWA-960]: https://jira.corp.magento.com/browse/PWA-960  
[PWA-1085]: https://jira.corp.magento.com/browse/PWA-1085  
[PWA-1665]: https://jira.corp.magento.com/browse/PWA-1665  
[PWA-2419]: https://jira.corp.magento.com/browse/PWA-2419  
[PWA-1689]: https://jira.corp.magento.com/browse/PWA-1689  
[PWA-1674]: https://jira.corp.magento.com/browse/PWA-1674  
[PWA-2528]: https://jira.corp.magento.com/browse/PWA-2528  
[PWA-2721]: https://jira.corp.magento.com/browse/PWA-2721  
[PWA-1961]: https://jira.corp.magento.com/browse/PWA-1961  
[PWA-2571]: https://jira.corp.magento.com/browse/PWA-2571  
[PWA-2593]: https://jira.corp.magento.com/browse/PWA-2593  
[PWA-2595]: https://jira.corp.magento.com/browse/PWA-2595  
[PWA-2524]: https://jira.corp.magento.com/browse/PWA-2524  
[3673]: https://github.com/magento/pwa-studio/pull/3673
[3717]: https://github.com/magento/pwa-studio/pull/3717
[3710]: https://github.com/magento/pwa-studio/pull/3710
[23]: https://github.com/magento-commerce/venia-sample-data-modules/pull/23
[3697]: https://github.com/magento/pwa-studio/pull/3697
[3720]: https://github.com/magento/pwa-studio/pull/3720
[8]: https://github.com/magento-commerce/upward-php/pull/8
[3661]: https://github.com/magento/pwa-studio/pull/3661
[3729]: https://github.com/magento/pwa-studio/pull/3729
[21]: https://github.com/magento-commerce/venia-sample-data-modules/pull/21
[3666]: https://github.com/magento/pwa-studio/pull/3666
[3740]: https://github.com/magento/pwa-studio/pull/3740
[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
[3747]: https://github.com/magento/pwa-studio/pull/3747/
[3761]:https://github.com/magento/pwa-studio/pull/3761/
[3686]: https://github.com/magento/pwa-studio/pull/3686/
[3760]: https://github.com/magento/pwa-studio/pull/3760/
[3808]: https://github.com/magento/pwa-studio/pull/3808/
