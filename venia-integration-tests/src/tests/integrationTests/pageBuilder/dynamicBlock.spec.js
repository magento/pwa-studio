import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe('verify pagebuilder dynamic block content is rendered correctly', () => {
    it('verify dynamic block content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/dynamicBlock/dynamicBlock.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Dynamic Block Snapshot',
                timeout: 60000
            });
        });
    });
});
