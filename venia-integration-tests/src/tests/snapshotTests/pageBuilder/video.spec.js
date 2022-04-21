import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe(
    'PWA-1161: verify pagebuilder video content is rendered correctly',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify video content alignment', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/video/video.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                //Temporary measure to stabilize 3rd party content loading test results.
                cy.wait(10000);
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Video Alignment Page'
                });
            });
        });
    }
);
