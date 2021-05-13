import { categorySweaters, productCarinaCardigan } from '../../../fixtures/categoryPage/index';

import { homePage } from '../../../fixtures/homePage/index';


// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify single wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', { fixture: 'pageBuilder/banner.json' }).as('getCMSMockData')
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body')
        cy.wait(10000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page'
            });
        });
    });
});
