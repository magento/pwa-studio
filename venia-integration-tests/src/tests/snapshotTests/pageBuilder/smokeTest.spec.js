import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
describe(
    'PWA-1165: verify pagebuilder smoke test content',
    { tags: ['@commerce', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify smoke test content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/smokeTest/smokeTest.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            //wait for product in banner slider to load
            cy.wait(5000);

            cy.scrollTo('bottom', { duration: 2000 });

            cy.get('[role="tabpanel"] button').should('be.visible');
            cy.get('.slick-slider')
                .eq(0)
                .scrollIntoView()
                .get('img[class*="imageLoaded"]')
                .should('be.visible');
            cy.get('.slick-slider')
                .eq(1)
                .scrollIntoView()
                .get('img[class*="imageLoaded"]')
                .should('be.visible');

            cy.get('div[class^="richContent-root"]')
                .eq(0)
                .find('iframe')
                .should('exist')
                .and('have.attr', 'src')
                .and('contain', 'youtube');

            cy.get('iframe')
                .invoke('attr', 'style', 'visibility: hidden !important')
                .should('not.be.visible');

            // Hide maps
            cy.get('*[class^="map-root-"]')
                .invoke('attr', 'style', 'visibility: hidden !important')
                .should('not.be.visible');

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Smoke Test',
                    timeout: 60000
                });
            });
        });

        it('verify smoke test cms block content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/smokeTest/cmsBlockTest.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');

            cy.get('[role="tabpanel"] button').should('be.visible');

            cy.get('div[class^="richContent-root"]')
                .eq(0)
                .find('iframe')
                .should('exist')
                .and('have.attr', 'src')
                .and('contain', 'youtube');

            // Scroll to bottom of the page to load all iframes
            cy.scrollTo('bottom', { duration: 2000 });

            // Hide iframes to prevent capturing moving images
            cy.get('iframe')
                .invoke('attr', 'style', 'visibility: hidden !important')
                .should('not.be.visible');

            // Hide maps
            cy.get('*[class^="map-root-"]')
                .invoke('attr', 'style', 'visibility: hidden !important')
                .should('not.be.visible');

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Smoke Test CMS Block Content',
                    timeout: 60000
                });
            });
        });

        it('verify smoke test dynamic block content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/smokeTest/dynamicBlockTest.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');

            cy.get('[role="tabpanel"] button').should('be.visible');

            cy.get('div[class^="richContent-root"]')
                .eq(0)
                .find('iframe')
                .should('exist')
                .and('have.attr', 'src')
                .and('contain', 'youtube');

            // Scroll to bottom of the page to load all iframes
            cy.scrollTo('bottom', { duration: 2000 });

            // Hide iframes to prevent capturing moving images
            cy.get('iframe')
                .invoke('attr', 'style', 'visibility: hidden !important')
                .should('not.be.visible');

            // Hide maps
            cy.get('*[class^="map-root-"]')
                .invoke('attr', 'style', 'visibility: hidden !important')
                .should('not.be.visible');

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Smoke Test Dynamic Block Content',
                    timeout: 60000
                });
            });
        });
    }
);
