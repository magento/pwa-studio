import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe(
    'PWA-1158: verify pagebuilder block content',
    { tags: ['@commerce', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify block content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/block/block.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.scrollTo('bottom', { duration: 2000 });
            cy.get('[role="tabpanel"] button').should('be.visible');
            cy.get('.slick-slider')
                .eq(0)
                .scrollIntoView()
                .get('img[loading="lazy"]')
                .should('be.visible');
            cy.get('.slick-slider')
                .eq(1)
                .scrollIntoView()
                .get('img[loading="lazy"]')
                .should('be.visible');

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Block Page',
                    timeout: 120000
                });
            });
        });

        it('verify block dynamic block content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/block/dynamicBlock.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Dynamic Block',
                    timeout: 60000
                });
            });
        });

        it('verify block cms block content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/block/cmsBlock.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder CMS Block',
                    timeout: 60000
                });
            });
        });

        it('verify block cms page content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/block/cmsPage.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder CMS Page',
                    timeout: 60000
                });
            });
        });
    }
);
