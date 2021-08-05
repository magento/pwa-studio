import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe('verify pagebuilder smoke test content', () => {
    it('verify smoke test content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/smokeTest/smokeTest.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Smoke Test',
                timeout: 60000
            });
        });
    });

    it('verify smoke test cms block content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/smokeTest/cmsBlockTest.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Smoke Test CMS Block Content',
                timeout: 60000
            });
        });
    });

    it('verify smoke test dynamic block content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/smokeTest/dynamicBlockTest.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Smoke Test Dynamic Block Content',
                timeout: 60000
            });
        });
    });
});
