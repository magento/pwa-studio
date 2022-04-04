import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe(
    'PWA-1157: verify pagebuilder column content is rendered correctly',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
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
    }
);

describe(
    'PWA-1471: Verify pagebuilder column media query',
    { tags: ['@commerce', '@open-source', '@ci'] },
    () => {
        it('should apply mediaQuery styles', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/column/column-media-query.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Column media query (Desktop)',
                    timeout: 60000
                });
            });
            cy.viewport('ipad-2');
            cy.captureFullPageScreenshot({
                name: 'Column media query (Mobile)',
                timeout: 60000
            });
        });
    }
);
