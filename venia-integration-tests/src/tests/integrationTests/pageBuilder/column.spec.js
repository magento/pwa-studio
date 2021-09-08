import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe('verify pagebuilder column content is rendered correctly', () => {
    it('verify column content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/column/column.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Column Page',
                timeout: 60000
            });
        });
    });
});
