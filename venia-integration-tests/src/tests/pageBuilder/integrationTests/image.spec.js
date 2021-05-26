import { homePage } from '../../../fixtures/homePage/index';

describe('pagebuilder > image', () => {
    it('renders properly', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/image/image.json'
        }).as('getCMSMockData');
        cy.visit(homePage);
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Image Snapshot',
                timeout: 60000
            });
        });
    });
});
