import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe(
    'PWA-1166: pagebuilder > image',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        context('desktop viewport', () => {
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

        context('mobile viewport', () => {
            beforeEach(() => {
                cy.viewport('iphone-5');
            });

            it('renders mobile version properly', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/image/image.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
                cy.loadFullPage().then(() => {
                    cy.captureFullPageScreenshot({
                        name: 'Page Builder Image Snapshot Mobile',
                        timeout: 60000
                    });
                });
            });
        });
    }
);
