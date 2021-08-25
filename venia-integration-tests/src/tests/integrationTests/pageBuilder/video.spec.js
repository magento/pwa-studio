import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe('verify pagebuilder video content is rendered correctly', () => {
    it('verify video content alignment', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/video/video.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Video Alignment Page'
            });
        });
    });
});
