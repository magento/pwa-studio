import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe(
    'PWA-1155: verify pagebuilder tabs content is rendered correctly',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
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
    }
);

describe(
    'PWA-1471: Verify pagebuilder tabs media query',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('should apply mediaQuery styles', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/tabs/tabs-media-query'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Tabs media query (Desktop)',
                    timeout: 60000
                });
            });
            cy.viewport('ipad-2');
            cy.captureFullPageScreenshot({
                name: 'Tabs media query (Mobile)',
                timeout: 60000
            });
        });
    }
);
