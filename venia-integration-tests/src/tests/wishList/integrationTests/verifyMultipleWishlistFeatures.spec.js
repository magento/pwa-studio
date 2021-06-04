import {
    accountAccess as accountAccessFixtures,
    homePage as homePageFixtures
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


const { assertCreateAccount } = myAccountMenuAssertions;


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

        cy.intercept('GET', '**/graphql?query=query+getMultipleWishlistsEnabled*', {
            fixture: 'wishlist/multipleWishlist/defaultPage.json'
        }).as('getDefaultPage');
        cy.visitPage(wishistRoute);
        cy.wait(['@getDefaultPage']).its('response.body');
        cy.intercept('POST', '**/graphql', {
            fixture: 'wishlist/multipleWishlist/createWishlist.json'
        }).as('createWishlist');
        cy.intercept('GET', '**/graphql?query=query+GetCustomerWishlis*', {
            fixture: 'wishlist/multipleWishlist/oneWishlistPage.json'
        }).as('getCustomerWishlist');
        createWishlist
        cy.wait(['@createWishlist']).its('response.body');
        cy.wait(['@getCustomerWishlist']).its('response.body');

        cy.visitPage(categorySweaters);
        addProductToWishlistFromCategoryPage(productCarinaCardigan);
        cy.intercept('POST', '**/graphql', {
            fixture: 'wishlist/multipleWishlist/createWishlist1.json'
        }).as('createWishlist1');
        createWishlistViaDialauge
        cy.wait(['@createWishlist1']).its('response.body');

        cy.visitPage(wishistRoute);
        
    });
});
