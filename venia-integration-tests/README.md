# Running Venia Integration Tests

## Setup

1. Clone the repo and change directory to pwa-studio/venia-integration-tests
2. Run `yarn install`
3. Run `yarn test`
4. Now select test to Run from Cypress UI.

## Run tests in headless mode

Running tests in the headless mode is the preferred option when testing in the CI. Before updating/creating the tests please run the tests in the headless mode to make sure they are running as expected.

`yarn test:headless` runs the tests in headless mode. It takes `--url` or `--baseUrl` as a required CLI argument. The URL provided will be used to run the tests against.

`yarn test:headless` also takes couple other arguments:

`--help`: Show all the CLI arguments supported by the headless mode
`--parallel` or `-p`: Will take a number argument. Number provided will represent the number of parallel async processes that will be used to speed up the tests.
_Note_: After testing we realized 4 is the best option while running locally. Adding more proccess might create more overhead so make sure you take due diligence while using this option.
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

[single wishlist]: https://github.com/magento/pwa-studio/blob/develop/venia-integration-tests/src/tests/wishList/e2eTests/singleWishlistAddRemoveProduct.spec.js
[multiple wishlist]: https://github.com/magento/pwa-studio/blob/develop/venia-integration-tests/src/tests/wishList/integrationTests/verifyMultipleWishlistFeatures.spec.js
