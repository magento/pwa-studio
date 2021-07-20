import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe('verify pagebuilder buttons content is rendered correctly', () => {
    it('verify buttons content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/buttons/buttons.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Buttons Page',
                timeout: 60000
            });
        });
    });
});
