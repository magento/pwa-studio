# PWA Studio Release 12.5.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 12.5.0_.
_For older release notes, see_ [PWA Studio releases][].

## Highlights

The 12.5.0 release of PWA Studio focuses on 2 areas:

- A new eventing framework
- Accessibility improvements

### Eventing

We have added a new eventing framework into PWA Studio. This framework allows users to send user event data to Adobe's Edge collection service. The framework includes a [series of events](https://developer.adobe.com/commerce/pwa-studio/integrations/analytics/event-reeference/) by default. Developers can extend the framework by [writing your own events](https://developer.adobe.com/commerce/pwa-studio/integrations/analytics/custom-events/) and you can also configure the framework so that 3rd party modules can subscribe to these events.

Included events are around:

- Cart operations
- Mini cart views
- Page views
- Product impressions and clicks
- Search requests
- User account actions

### Accessibility

We have made numerous improvements around accessibility in Venia. Most of these changes are around ensuring proper text and button contrast and ensuring that screen readers are getting proper information from Venia.

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

XXXX Need to add


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
| Story | \[Issue] Make Apollo links customizable                                                   | [3842][]  |
| Story | Track Page Views                                                                          | [3856][]  |
| Story | Track Search Requests                                                                     | [3844][]  |
| Story | Track Cart operations                                                                     | [3860][]  |
| Story | Deprecate / Remove the Venia Adobe Data Layer extension                                   | [3863][]  |
| Story | Track product impressions and clicks                                                      | [3859][]  |
| Bug   | \[Group 2]\[Issue] BUG#AC-2499::When focusing on 'Venia' image while using screen reader… | [3858][]  |
| Bug   | \[bug]: Mega menu collapses when trying to select sub-category on 12.4                    | [3850][]  |

## Documentation updates

- Added documentation for the [analytics](https://developer.adobe.com/commerce/pwa-studio/integrations/analytics/) work.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 12.4.0 to 12.5.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://developer.adobe.com/commerce/pwa-studio/tutorials/
[upgrading versions]: https://developer.adobe.com/commerce/pwa-studio/guides/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 12.5.0.

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

[PWA Studio releases]: https://github.com/magento/pwa-studio/releases
