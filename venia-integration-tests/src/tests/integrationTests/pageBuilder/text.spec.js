import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe('verify pagebuilder text content is rendered correctly', () => {
    it('verify text content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/text/text.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Text Page',
                timeout: 60000
            });
        });
    });
});
