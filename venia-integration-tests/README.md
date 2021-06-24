# Running Venia Integration Tests

## Setup

1. Clone the repo and change directory to pwa-studio/venia-integration-tests
2. Run `yarn install`
3. Run `yarn test`
4. Now select test to Run from Cypress UI.

# Adding Cypress UI Tests

We follow Test Triangle for testing pwa-studio project where we expect most of our code coverage by Unit tests. This allows us to be very less dependent on UI tests which are expensive to maintain and can be very unstable in long run.

When you are developing any UI interaction on venia it can be a button, link, text field, check boxes or radio buttons these should be automated in Cypress as needed.

Currently we have divided UI tests in following categories -

## Venia End to End Tests
In this category we add Cypress tests for any End to End user flows based on Magento default configurations. These tests do not involve any UI level mocking of data meaning all the data the UI needs to redner comes from the network i.e. Venia sample data. Please refer to [single wishlist][] test as an example.

## Venia Integration Tests
In this category we add Cypress tests for user flows which are on Magento non-default configurations. These tests run on mocked data. Please refer to [multiple wishlist][] test as an example. This example test is a very large test given auth user session restriction, but we prefer to have these mock data tests as small as possible.

[single wishlist]: https://github.com/magento/pwa-studio/blob/develop/venia-integration-tests/src/tests/wishList/e2eTests/singleWishlistAddRemoveProduct.spec.js
[multiple wishlist]: https://github.com/magento/pwa-studio/blob/develop/venia-integration-tests/src/tests/wishList/integrationTests/verifyMultipleWishlistFeatures.spec.js
