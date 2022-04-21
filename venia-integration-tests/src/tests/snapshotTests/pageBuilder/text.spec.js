import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe(
    'PWA-1164: verify pagebuilder text content is rendered correctly',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
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
    }
);
