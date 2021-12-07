# Running Venia Integration Tests

## Setup

1. Clone the repo and change directory to pwa-studio/venia-integration-tests
2. Run `yarn install`
3. Run `yarn test`
4. Now select test to Run from Cypress UI.

### NOTE

`packages/venia-concept/.env` must have variable set `BABEL_KEEP_ATTRIBUTES=true` in order to load `data-cy` and keep data attributes for Cypress on test deployed instances.

## Run tests in headless mode

Running tests in the headless mode is the preferred option when testing in the Continuous Integration. Before updating/creating any tests, please run the test suite in headless mode to make sure they are running as expected.

Run the following command to test in headless mode:

`yarn test:headless`

Use the **required** `--url` or `--baseUrl` parameter to provide the URL of **your storefront application** the tests will run against.

`yarn test:headless` also accepts the following arguments:

`--help`: Show all the CLI arguments supported by the headless mode

`--threads` or `-t`: Will take a number argument that specifies the number of parallel async processes that will be used to speed up the tests.

___Note___: _After testing we realized 4 is the best option while running locally. Adding more proccess might create more overhead, so make sure you take due diligence while using this option._

`--update` or `-u`: Use this option if you want to update the snapshots.

`--spec` or `-s`: String of comma separated test files to run. If not provided all tests will run.

Example:

`yarn test:headless -u --url https://develop.pwa-venia.com -p 4 -s ./src/tests/integrationTests/pageBuilder/banner.spec.js,./src/tests/e2eTests/wishList/singleWishlistAddRemoveProduct.spec.js`

# Adding Cypress UI Tests

We follow Test Triangle for testing pwa-studio project where we expect most of our code coverage by Unit tests. This allows us to be very less dependent on UI tests which are expensive to maintain and can be very unstable in long run.

When you are developing any UI interaction on venia it can be a button, link, text field, check boxes or radio buttons these should be automated in Cypress as needed.

Currently we have divided UI tests in following categories -

## Venia End to End Tests
In this category we add Cypress tests for any End to End user flows based on Magento default configurations. These tests do not involve any UI level mocking of data meaning all the data the UI needs to redner comes from the network i.e. Venia sample data. Please refer to [single wishlist][] test as an example.

## Venia Integration Tests
In this category we add Cypress tests for user flows which are on Magento non-default configurations. These tests run on mocked data. Please refer to [multiple wishlist][] test as an example. This example test is a very large test given auth user session restriction, but we prefer to have these mock data tests as small as possible.

[single wishlist]: https://github.com/magento/pwa-studio/blob/develop/venia-integration-tests/src/tests/e2eTests/wishList/singleWishlistAddRemoveProduct.spec.js
[multiple wishlist]: https://github.com/magento/pwa-studio/blob/develop/venia-integration-tests/src/tests/integrationTests/wishList/verifyMultipleWishlistFeatures.spec.js

# Folders Structure
The insertion of Cypress into PWA Studio followed the best practice guidelines cited in the official Cypress documentation.
We used some of the frameworks they suggested.

## src/actions
Where the actions required to manipulate the UI are located.
Functions that perform the UI interactions in Venia, such as: selecting a specific field, clicking a button, filling in an input, any UI action that is required.

## src/assertions
Where the test assertions are located, what should be expected when performing a particular test. The default provided by the Cypress API is the [Chai assertion library][].

[Chai assertion library]: https://docs.cypress.io/guides/references/assertions

## src/fields
In this folder you can locate the files that refer to the Venia UI element selectors, so that Cypress can select the correct element.
The selection pattern `'[data-cy="element"]'` has been used according to the [Cypress API selector patterns][].

[Cypress API selector patterns]: https://docs.cypress.io/api/cypress-api/selector-playground-api

In the case of chaining selectors, such as:

`export const signInEmailTextField = '[data-cy="AccountMenu-root"] [data-cy="SignIn-form"] [data-cy="email"]'`

Component chaining was used, giving the necessary specificity to each element. The component selectors were determined with the first letters capitalized, as per the `React.JS` standard.

## src/plugins

As the name implies, this is where the files for the plugins used in the application are located.
For information on how to apply the plugins required for your application, check the official [Plugins | Cypress documentation][].

[Plugins | Cypress documentation]: https://docs.cypress.io/guides/tooling/plugins-guide

## src/snapshots

In this directory you will find the snapshots of the tests performed by Cypress, usually this directory is inserted in the `.gitignore`, they are used to answer questions about the testing process, but they are not necessarily fundamental for performing the tests.

## src/support

Originally the `src/support/index.js` file runs before all `spec.js`, so functions common to all tests are inserted into this file.

We use the support directory to concentrate the actions that are common to the application, such as actions to login, logout, create users, visit certain pages in the application, routes, etc.

## src/tests

Where the Cypress test files for the application are located.

_You can find other articles on best practices and design patterns on the [Cypress documentation][]._

[Cypress documentation]: https://docs.cypress.io/guides/core-concepts/introduction-to-cypress
