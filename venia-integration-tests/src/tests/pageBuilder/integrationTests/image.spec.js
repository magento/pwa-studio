import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe('pagebuilder > image', () => {
    it('renders properly', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/image/image.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Image Snapshot',
                timeout: 60000
            });
        });
    });
});
