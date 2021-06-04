import {
    accountAccess as accountAccessFixtures,
    homePage as homePageFixtures,
    categoryPage as categoryPageFixtures,
    wishlist as wishlistFixtures
} from '../../../fixtures';
import {
    myAccountMenu as myAccountMenuAssertions
} from '../../../assertions';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const { homePage } = homePageFixtures;
const { categoryTops, productCarinaCardigan } = categoryPageFixtures;

const { assertCreateAccount } = myAccountMenuAssertions;
const { wishistRoute } = wishlistFixtures;


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
        cy.wait(['@getCustomerWishlist']).its('response.body');
        cy.wait(['@getWishlistConfig']).its('response.body');


        // cy.intercept('POST', '**/graphql', (req) => {
        //     if (req.body.operationName.includes('createWishlist')) {
        //         req.reply({fixture: 'wishlist/multipleWishlist/wishlistPageCreateWishlist1.json'});
        //     }
        // }).as('createWishlist1');
        // cy.intercept('GET', '**/graphql?query=query+GetCustomerWishlis*', {
        //     fixture: 'wishlist/multipleWishlist/oneWishlistNoProductsPage.json'
        // }).as('getCustomerWishlist');

        // invokeCreateWishlistDialog();
        // createWishlist(name1);
        // cy.wait(['@createWishlist1']).its('response.body');
        // cy.wait(['@getCustomerWishlist']).its('response.body');

        // assertWishlistExists
        // assertCreateListExists

        // cy.visitPage(categoryTops);
        // addProductToWishlistFromCategoryPage(productCarinaCardigan);

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
