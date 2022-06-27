# PWA Studio Release 12.5.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.5.0_.
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 12.5.0 release of PWA Studio focuses on 2 areas:

- A new eventing framework
- Accessibility improvements

### Eventing

The main feature introduced in PWA Studio 12.5 is the [eventing framework](https://developer.adobe.com/commerce/pwa-studio/guides/general-concepts/eventing/).

This framework lets developers write code that subscribes to event data published by the application.
This data can be sent to different analytics services, such as the Adobe Experience Platform.

The framework also provides an [API](https://developer.adobe.com/commerce/pwa-studio/api/events/) that lets extension developers send out events in their own components.
A [sample extension](https://github.com/magento/pwa-studio/tree/develop/packages/extensions/venia-sample-eventing) is included in this release to serve as a starting point or tutorial for developers.

This release also include the [Experience Platform Connector](https://developer.adobe.com/commerce/pwa-studio/integrations/adobe-commerce/aep/), a PWA Studio extension that can be installed into a storefront project.
This extension leverages the eventing framework to collect and send data to the Adobe Experience Platform.

The core events published by the framework include:

- Cart operations
- Mini cart views
- Page views
- Product impressions and clicks
- Search requests
- User account actions

### Accessibility

We have made numerous improvements around accessibility in the Venia template project. Most of these changes are around ensuring proper text and button contrast and ensuring that screen readers are getting proper information from the application.

## Other highlights and fixes

-   We now ensure that custom controls provide accessible names and indicate their expanded or collapsed state. — [3857][]
-   Screen readers are now informed when a new page view loads. — [3858][]
-   Increased contrast on the custom blue focus indicator. — [3858][]
-   Fixed gray text in Venia that did not have sufficient contrast. — [3858][]
-   Visual indicators of state now provide a proper contrast ratio of at least 3:1 against the background color. — [3857][]
-   Checkout payment buttons and text now have proper contrast ratios. — [3857][]
-   The shopping cart button now properly reports its state to screen readers. — [3858][]
-   Apollo links can now be customized by a \`configureLinks\` prop to \`Adapter / useAdapter\`.  Apollo code has been extracted to its own module. — [3842][]
-   Added dispatcher for search requests. — [3844][]
-   Removed venia-adobe-data-layer extension as its functionality is incorporated into the Magento Storefront Events SDK. — [3863][]
-   Fixed issue where focusing on an image in Venia would cause screen readers to say "Venia Venia". Now it only says it once. — [3858][]
-   Fixed the Mega menu accidentally closing while accessing secondary menus. — [3850][]

## 12.5.0 Lighthouse scores

With each new release of PWA Studio, we perform Lighthouse audits of four Venia page types, each representing a different level of complexity. Shown below are the Lighthouse scores for the 12.5.0 release of these pages on desktop and mobile devices.

### Desktop scores

|  | Home Page | Product Category | Product Details | Search Results |
| ------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| **Desktop** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
| Performance | ![](images/score_89.svg) | ![](images/score_88.svg) | ![](images/score_61.svg) | ![](images/score_84.svg) |
| Accessibility | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| Best Practices | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| SEO | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| PWA | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) | ![](images/pwa_perfect.svg) |

### Mobile scores

|  | &nbsp;&nbsp;Home Page&nbsp;&nbsp; | Product Category | Product Details | Search Results |
| ------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| **Mobile** | ![](images/venia_page_home.png) | ![](images/venia_page_category.png) | ![](images/venia_page_details.png) | ![](images/venia_page_search.png) |
| Performance | ![](images/score_21.svg) | ![](images/score_32.svg) | ![](images/score_34.svg) | ![](images/score_31.svg) |
| Accessibility | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| Best Practices | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| SEO | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) | ![](images/score_100.svg) |
| PWA | ![](images/pwa_imperfect.svg) | ![](images/pwa_imperfect.svg) | ![](images/pwa_imperfect.svg) | ![](images/pwa_imperfect.svg) |


| Type  | Description                                                                               | GitHub PR |
| :---- | :---------------------------------------------------------------------------------------- | :-------- |
| Story | Track Mini Cart Views                                                                     | [3843][]  |
| Story | 5 Track Checkout                                                                          | [][]      |
| Story | Track user account actions                                                                | [3855][]  |
| Story | \[Issue] AC-2785::Custom dropdown controls lack appropriate name and state inf…           | [3857][]  |
| Story | \[Group 2]\[Issue] AC-2482::Screen readers not informed when new page view loads. (patte… | [3858][]  |
| Story | \[Group 2]\[Issue] AC-2483::Contrast insufficient - custom blue focus indicator           | [3858][]  |
| Story | \[Group 2]\[Issue] AC-2486::contrast insufficient - medium grey text (Search Results)     | [3858][]  |
| Story | \[Issue] AC-2490::Contrast insufficient - product image selected state indicat…           | [3857][]  |
| Story | \[Issue] AC-2496::Contrast insufficient - light grey text (Checkout - Payment)            | [3857][]  |
| Story | \[Group 2]\[Issue] AC-2786::Shopping bag button does not programmatically communicate st… | [3858][]  |
| Story | Experience Platform Connector extension                                                   | [3885][]  |
| Story | \[Issue] Make Apollo links customizable                                                   | [3842][]  |
| Story | Track Page Views                                                                          | [3856][]  |
| Story | Track Search Requests                                                                     | [3844][]  |
| Story | Track Cart operations                                                                     | [3860][]  |
| Story | Deprecate / Remove the Venia Adobe Data Layer extension                                   | [3863][]  |
| Story | Track product impressions and clicks                                                      | [3859][]  |
| Bug   | \[Group 2]\[Issue] BUG#AC-2499::When focusing on 'Venia' image while using screen reader… | [3858][]  |
| Bug   | \[bug]: Mega menu collapses when trying to select sub-category on 12.4                    | [3850][]  |

## Documentation updates

- [eventing overview](https://developer.adobe.com/commerce/pwa-studio/guides/general-concepts/eventing/)
- [Event API](https://developer.adobe.com/commerce/pwa-studio/api/events/)
- [Custom Events](https://developer-stage.adobe.com/commerce/pwa-studio/tutorials/events/custom-events/)
- [Subscribing to events](https://developer.adobe.com/commerce/pwa-studio/tutorials/events/subscribe-events/)
- [Adobe Experience Platform](https://developer-stage.adobe.com/commerce/pwa-studio/integrations/adobe-commerce/aep/)

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.4.0 to 12.5.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.5.0.

**Note:**
Your project may not depend on some packages listed in this table.

| Package                             | Latest version |
|-------------------------------------|----------------|
| `babel-preset-peregrine`            | **1.2.1**      |
| `create-pwa`                        | **2.3.1**      |
| `experience-platform-connector`     | **1.0.0**      |
| `upward-security-headers`           | **1.0.9**      |
| `venia-sample-backends`             | **0.0.8**      |
| `venia-sample-eventing`             | **0.0.1**      |
| `venia-sample-language-packs`       | **0.0.8**      |
| `venia-sample-payments-checkmo`     | **0.0.7**      |
| `pagebuilder`                       | **7.4.0**      |
| `peregrine`                         | **12.5.0**     |
| `pwa-buildpack`                     | **11.4.0**     |
| `pwa-theme-venia`                   | **1.4.0**      |
| `upward-js`                         | **5.4.0**      |
| `upward-spec`                       | **5.2.1**      |
| `venia-concept`                     | **12.5.0**     |
| `venia-ui`                          | **9.5.0**      |
| `magento2-pwa`                      | **0.2.2**      |
| `magento2-pwa-commerce`             | **0.0.2**      |
| `magento-venia-sample-data-modules` | **0.0.3**      |
| `magento-venia-sample-data-modules-ee`| **0.0.2**    |
| `magento2-upward-connector`         | **2.0.1**      |
| `upward-php`                        | **2.0.1**      |

[3843]: https://github.com/magento/pwa-studio/pull/3843
[3855]: https://github.com/magento/pwa-studio/pull/3855
[3857]: https://github.com/magento/pwa-studio/pull/3857
[3858]: https://github.com/magento/pwa-studio/pull/3858
[3858]: https://github.com/magento/pwa-studio/pull/3858
[3858]: https://github.com/magento/pwa-studio/pull/3858
[3857]: https://github.com/magento/pwa-studio/pull/3857
[3857]: https://github.com/magento/pwa-studio/pull/3857
[3858]: https://github.com/magento/pwa-studio/pull/3858
[3842]: https://github.com/magento/pwa-studio/pull/3842
[3856]: https://github.com/magento/pwa-studio/pull/3856
[3844]: https://github.com/magento/pwa-studio/pull/3844
[3860]: https://github.com/magento/pwa-studio/pull/3860
[3863]: https://github.com/magento/pwa-studio/pull/3863
[3859]: https://github.com/magento/pwa-studio/pull/3859
[3858]: https://github.com/magento/pwa-studio/pull/3858
[3850]: https://github.com/magento/pwa-studio/pull/3850
[3885]: https://github.com/magento/pwa-studio/pull/3885

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
