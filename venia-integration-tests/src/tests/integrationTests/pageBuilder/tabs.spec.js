import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe('verify pagebuilder tabs content is rendered correctly', () => {
    it('verify tabs content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/tabs/tabs.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Tabs Page',
                timeout: 60000
            });
        });
    });
});
