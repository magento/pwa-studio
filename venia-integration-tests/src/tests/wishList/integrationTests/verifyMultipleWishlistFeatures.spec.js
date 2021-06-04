import {
    accountAccess as accountAccessFixtures,
    homePage as homePageFixtures,
    wishlist as wishlistFixtures,
    categoryPage as categoryPageFixtures
} from '../../../fixtures';
import {
    myAccountMenu as myAccountMenuAssertions,
    wishlist as wishlistAssertions,
    categoryPage as categoryPageAssertions
} from '../../../assertions';
import {
    wishlistPage as wishlistPageActions,
    categoryPage as categoryPageActions,
} from '../../../actions';
const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const { homePage } = homePageFixtures;
const { assertCreateAccount } = myAccountMenuAssertions;
const { wishistRoute } = wishlistFixtures;
const { createWishlist } = wishlistPageActions;
const {
    assertEmptyWishlistPage,
    assertEmptyWishlistExists,
    assertCreateWishlistLink
} = wishlistAssertions;
const { categoryTops, productCarinaCardigan } = categoryPageFixtures;
const { addProductToWishlistFromCategoryPage } = categoryPageActions;
const { assertWishlistSelectedProductOnCategoryPage } = categoryPageAssertions;

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify single wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        cy.visitPage(homePage);

        cy.openLoginDialog();
        cy.createAccount(
            accountAccessFixtures.firstName,
            lastName,
            accountEmail,
            accountPassword
        );

        assertCreateAccount(firstName);

        cy.intercept('GET', '**/graphql?query=query+GetCustomerWishlist*', {
            fixture: 'wishlist/multipleWishlist/noWishlistPage.json'
        }).as('getCustomerWishlist');
        cy.intercept('GET', '**/graphql?query=query+getMultipleWishlistsEnabled*', {
            fixture: 'wishlist/multipleWishlist/multipleWishlistEnabled.json'
        }).as('getWishlistConfig');

        cy.visitPage(wishistRoute);

        assertEmptyWishlistPage();
        assertCreateWishlistLink();

        cy.wait(['@getCustomerWishlist']).its('response.body');
        cy.wait(['@getWishlistConfig']).its('response.body');


        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('createWishlist')) {
                req.reply({ fixture: 'wishlist/multipleWishlist/wishlistPageCreateWishlist1.json' });
            }
        }).as('createWishlist1');
        cy.intercept('GET', '**/graphql?query=query+GetCustomerWishlist*', {
            fixture: 'wishlist/multipleWishlist/oneWishlistNoProductsPage.json'
        }).as('getCustomerWishlist1');

        createWishlist('Test List1');
        cy.wait(['@createWishlist1']).its('response.body');
        cy.wait(['@getCustomerWishlist1']).its('response.body');

        assertEmptyWishlistExists('Test List1');
        assertCreateWishlistLink();

        cy.intercept('GET', '**/graphql?query=query+GetWishlistItemsForLocalField*', {
            fixture: 'wishlist/multipleWishlist/categoryPageGetWishListDataForLocalFields.json'
        }).as('getWishlistLocalFields');
        cy.intercept('GET', '**/graphql?query=query+GetWishlistConfigForGallery*', {
            fixture: 'wishlist/multipleWishlist/categoryPageGetWishlistConfigForGallery.json'
        }).as('getGalleryWishlist');
        cy.intercept('GET', '**/graphql?query=query+getWishlistsDialogData*', {
            fixture: 'wishlist/multipleWishlist/categoryPageGetWishlistDialogData.json'
        }).as('getCustomerWishlist2');

        cy.visitPage(categoryTops);
        cy.wait(['@getWishlistLocalFields']).its('response.body');
        cy.wait(['@getGalleryWishlist']).its('response.body');
        cy.wait(['@getCustomerWishlist2']).its('response.body');

        addProductToWishlistFromCategoryPage(productCarinaCardigan);

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('createWishlist')) {
                req.reply({ fixture: 'wishlist/multipleWishlist/categoryPageCreateWishlist2.json' });
            }
        }).as('createWishlist2');
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('addProductToWishlist')) {
                req.reply({ fixture: 'wishlist/multipleWishlist/categoryPageAddProductToWishlist.json' });
            }
        }).as('addProductToWishlist');
        cy.intercept('GET', '**/graphql?query=query+getWishlistsDialogData*', {
            fixture: 'wishlist/multipleWishlist/categoryPageGetWishlistDialogDataUpdated.json'
        }).as('getCustomerWishlist3');
        cy.intercept('GET', '**/graphql?query=query+GetWishlistItemsForLocalField*', {
            fixture: 'wishlist/multipleWishlist/categoryPageGetWishListDataForLocalFieldsUpdated.json'
        }).as('getWishlistLocalFields1');

        createWishlist('Test List2');
        cy.wait(['@createWishlist2']).its('response.body');
        cy.wait(['@addProductToWishlist']).its('response.body');
        cy.wait(['@getCustomerWishlist3']).its('response.body');
        cy.wait(['@getWishlistLocalFields1']).its('response.body');

        assertWishlistSelectedProductOnCategoryPage(productCarinaCardigan);

        // cy.intercept('POST', '**/graphql', (req) => {
        //     if (req.body.operationName.includes('createWishlist')) {
        //         req.reply({fixture: 'wishlist/multipleWishlist/createWishlist2.json'});
        //     }
        // }).as('createWishlist2');
        // cy.intercept('POST', '**/graphql', (req) => {
        //     if (req.body.operationName.includes('addProductToWishlist')) {
        //         req.reply({fixture: 'wishlist/multipleWishlist/addProductToWishlistCategoryPage.json'});
        //     }
        // }).as('addProductToWishlistCategoryPage');
        // cy.intercept('GET', '**/graphql?query=query+getWishlistsDialogData*', {
        //     fixture: 'wishlist/multipleWishlist/categoryGetWishlistDialogData.json'
        // }).as('categoryGetWishlistDialogData');


        // createWishlist(name2);
        // cy.wait(['@createWishlist2']).its('response.body');

        // cy.visitPage(wishistRoute);

    });
});
