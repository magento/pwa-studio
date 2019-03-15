# Release 2.0

## Table of contents

* [2.1.0](#whats-new-in-210)
* [2.0.0](#whats-new-in-200)

## What's new in 2.1.0

Release **2.1.0** is a compatibility release for the core **Magento 2.3.1** release.

Notable changes include:

* Updated GraphQL queries
* Magento GraphQL query validation tool

### Updated GraphQL queries

The Magento 2.3.1 release contains GraphQL schema changes that are not compatible with PWA Studio 2.0.0 presentational components.
This release adds a mapping layer to the wrapper components to maintain backwards compatibility for the presentational components.

This update also includes a change to the `.env.dist` file in the Venia project.
This change sets the `MAGENTO_BACKEND_URL` variable to that of a Magento 2.3.1 instance.

If you have previously set up Venia and copied the `.env.dist` file into your project's `.env` file, you must update the `MAGENTO_BACKEND_URL` variable to keep your project compatible.

Pull Request: [#990](https://github.com/magento-research/pwa-studio/pull/990)

### Query validation tool

PWA Studio 2.1.0 creates a new `graphql-cli` plugin called `validate-magento-pwa-queries` to replace the `validate-queries.js` script in the Venia package.

This tool lets developers know when a breaking change occurs with GraphQL to address incompatibility or breaking changes.
It provides clear error messages regarding where and how to resolve issues.

Pull Request: [#1004](https://github.com/magento-research/pwa-studio/pull/1004)

### Other updates

* Unit tests created to increase test coverage
* Documentation typo fixes
* Devdocs script created for auto-generating reference docs from source
* Misc code cleanup
* Bugfix for shopping cart error when continuing to shop after checkout
* Bugfix for the full screen checkout drawer
* Bugfix for pagination persisting during Query loading state
* Bugfix for Search autocomplete rendering loading component on clear

## What's new in 2.0.0

This is a brief development summary for the 2.0.0 release.

For a list of relevant Pull Requests related to the 2.0 release, see this [GitHub query result][].

### Server platform and language independence

-   UPWARD spec introduced for cross platform server behavior configuration.
    An UPWARD file describes a stack-agnostic server that is used for server side rendering, asset delivery, and proxying.
-   A PWA package can now define its network requirements in an UPWARD file.
-   A PWA can now be deployed on any tech stack as long as the server is UPWARD compliant.
-   UPWARD servers implemented in [NodeJS][] and [PHP][]
-   UPWARD spec published and open for community contribution.

#### Related documentation updates

-   [UPWARD spec overview][]([#382][])
-   [UPWARD-js server][]([#382][])

### Improved developer experience

-   Implemented consistent patterns for workflow, such as action/reducer organization and container/presentational separation, in the Venia reference storefront source code.
-   Venia components are now portable and can be used in any React application.
-   New centralized driver and adapter concepts for all PWA-Studio component input/output.
-   Configurable low level UI elements, such as lists and forms, available for developers without the need for drivers or adapters.
-   Improved error handling to help detection and recoverability.

#### Related documentation updates

-   [Modular Venia components][] ([#796][])
-   [Venia directory structure][]([#487][] [#752][])

### Venia app-like experience

-   Pagination feature added to Venia reference storefront for app-like navigation.
-   Inline checkout implemented in the Venia reference storefront.
-   Basic account creation and management implemented in Venia.
-   Loading state implemented to improved the app-like experience.

#### Related documentation updates

-   [Venia Checkout implementation][] ([#673][])

### Improved shopper experience

-   Braintree checkout integration in the Venia reference storefront.
-   Search with intelligent previews implemented in the Venia reference storefront.

#### Related documentation updates

-   [Braintree integration][]([#793][])

### PWA compliance

-   Web App Manifest file created for the Venia reference storefront.
    This file provides the metadata for adding the Venia storefront to a mobile home screen.
-   Service worker optimizations.

### Performance enhancements

-   Smart caching implemented to improve service worker catalog caching
-   Bandwidth usage optimizations achieved using:
    -   Dynamic image compression/resize
    -   Advanced minification
    -   Bundle splitting
-   Improved app performance on devices, including smoother renders and faster [Time To First Meaningful Paint][].

### GraphQL usage

-   GraphQL usage increased to match coverage updates in Magento 2.3.0.

### Magento Cloud compatibility

-   A new Magento module (`Magento_UpwardConnector`) is available to route frontend requests through an UPWARD-PHP server.
-   Solution Implementers(SI) can replace existing Magento cloud storefronts with a new PWA storefront using the UPWARD connector module.
-   Documentation created for deploying storefront to Magento Cloud
-   Assistance offered by Magento Enterprise Cloud deployment team

#### Related documentation updates

-   [README][] for the `Magento_UpwardConnector` module, which contains Cloud deployment instructions.

### Other documentation updates

#### New topics

-   [Theme vs Storefront][] ([#509][])
-   [Install Venia sample data][] ([#474][])
-   [Peregrine Routing][] ([#453][])

#### Updated topics

-   [Certificate and Valet+ troubleshooting][] ([#637][])
-   [Tools and Libraries][] ([#621][])

## Known issues

-   After submitting a successful order, the application throws up an error notification, and the user has to actively click out of the error notification. ([#916][])
-   Create account page displayed with null values for email, first and last name when creating an account during a guest checkout. ([#830][])
-   (Mobile specific) When there are more categories, users cannot scroll to Sign in button. It blocks user from signing to the account. ([#824][])

## Other notable updates

-   Switched from NPM to Yarn for package management
-   **Setup Venia storefront** video developed and available in Magento U

[braintree integration]: https://magento-research.github.io/pwa-studio/venia-pwa-concept/features/braintree/
[#793]: https://github.com/magento-research/pwa-studio/pull/793
[readme]: https://github.com/magento-research/magento2-upward-connector
[upward-js server]: https://magento-research.github.io/pwa-studio/technologies/upward/reference-implementation/
[upward spec overview]: https://magento-research.github.io/pwa-studio/technologies/upward/
[#382]: https://github.com/magento-research/pwa-studio/pull/382
[peregrine routing]: https://magento-research.github.io/pwa-studio/peregrine/routing/
[#453]: https://github.com/magento-research/pwa-studio/pull/453
[install venia sample data]: https://magento-research.github.io/pwa-studio/venia-pwa-concept/install-sample-data/
[#474]: https://github.com/magento-research/pwa-studio/pull/474
[theme vs storefront]: https://magento-research.github.io/pwa-studio/technologies/theme-vs-storefront/
[#509]: https://github.com/magento-research/pwa-studio/pull/509
[venia checkout implementation]: https://magento-research.github.io/pwa-studio/venia-pwa-concept/features/checkout/
[#673]: https://github.com/magento-research/pwa-studio/pull/673
[modular venia components]: https://magento-research.github.io/pwa-studio/venia-pwa-concept/features/modular-components/
[#796]: https://github.com/magento-research/pwa-studio/issues/796
[venia directory structure]: https://magento-research.github.io/pwa-studio/venia-pwa-concept/project-structure/
[#752]: https://github.com/magento-research/pwa-studio/pull/752
[#487]: https://github.com/magento-research/pwa-studio/pull/487
[tools and libraries]: https://magento-research.github.io/pwa-studio/technologies/tools-libraries/
[#621]: https://github.com/magento-research/pwa-studio/pull/621
[certificate and valet+ troubleshooting]: https://magento-research.github.io/pwa-studio/pwa-buildpack/troubleshooting/
[#637]: https://github.com/magento-research/pwa-studio/pull/637
[#916]: https://github.com/magento-research/pwa-studio/issues/916
[#830]: https://github.com/magento-research/pwa-studio/issues/83o
[#824]: https://github.com/magento-research/pwa-studio/issues/824
[nodejs]: https://magento-research.github.io/pwa-studio/technologies/upward/reference-implementation/
[php]: https://github.com/magento-research/magento2-upward-connector
[time to first meaningful paint]: https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint
[GitHub query result]: https://github.com/magento-research/pwa-studio/pulls?page=1&q=is%3Apr+is%3Amerged+base%3Arelease%2F2.0+review%3Aapproved+NOT+fix+in%3Atitle+NOT+fixed+in%3Atitle+NOT+chore+in%3Atitle+NOT+test+in%3Atitle&utf8=%E2%9C%93
