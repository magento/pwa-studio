import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe(
    'PWA-1168: verify pagebuilder divider content is rendered correctly',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify divider content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/divider/divider.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Divider Page',
                    timeout: 60000
                });
            });
        });
    }
);
