import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;

describe(
    'PWA-1167: verify pagebuilder products content type',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        context('desktop viewport', () => {
            it('verify products grid', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-grid.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
                cy.get('*[class*="products-root-"]')
                    .eq(0)
                    .scrollIntoView()
                    .get('img[class*="imageLoaded"]')
                    .should('be.visible');
                cy.loadFullPage().then(() => {
                    cy.captureFullPageScreenshot({
                        name: 'PB Products Grid',
                        timeout: 60000
                    });
                });
            });

            it('verify products grid sorting', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-grid-sorting.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
                cy.loadFullPage().then(() => {
                    cy.captureFullPageScreenshot({
                        name: 'PB Products Grid Sorting',
                        timeout: 60000
                    });
                });
            });

            it('verify products carousel', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-carousel-1.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
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
                        name: 'PB Products Carousel',
                        timeout: 60000
                    });
                });
            });

            it('verify products carousel alignment', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-carousel-2.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
                cy.loadFullPage().then(() => {
                    cy.captureFullPageScreenshot({
                        name: 'PB Products Carousel Alignment',
                        timeout: 60000
                    });
                });
            });

            it('verify products carousel styles', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-carousel-3.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
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
                        name: 'PB Products Carousel Styles',
                        timeout: 60000
                    });
                });
            });

            it('verify products carousel default mode', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-carousel-4.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
                cy.loadFullPage().then(() => {
                    cy.captureFullPageScreenshot({
                        name: 'PB Products Carousel Default Mode',
                        timeout: 60000
                    });
                });
            });

            it('verify products carousel continuous mode', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-carousel-4.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
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
                cy.get('h2')
                    .contains('No autoplay, loop, arrows, dots')
                    .next()
                    .find('li[role="tab"]')
                    .contains('Continuous')
                    .click();
                cy.get('h2')
                    .contains('No autoplay, no loop, arrows, dots')
                    .next()
                    .find('li[role="tab"]')
                    .contains('Continuous')
                    .click();
                cy.get('h2')
                    .contains('No autoplay, loop, no arrows, no dots')
                    .next()
                    .find('li[role="tab"]')
                    .contains('Continuous')
                    .click();

                cy.loadFullPage().then(() => {
                    cy.captureFullPageScreenshot({
                        name: 'PB Products Carousel Continuous Mode',
                        timeout: 60000
                    });
                });
            });
        });

        context('mobile viewport', () => {
            beforeEach(() => {
                cy.viewport('iphone-5');
            });

            it('verify products grid mobile', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-grid.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
                cy.loadFullPage().then(() => {
                    cy.captureFullPageScreenshot({
                        name: 'PB Products Grid Mobile',
                        timeout: 60000
                    });
                });
            });

            it('verify products carousel mobile', () => {
                cy.intercept('GET', getCMSPage, {
                    fixture: 'pageBuilder/products/products-carousel-1.json'
                }).as('getCMSMockData');
                cy.visitHomePage();
                cy.wait(['@getCMSMockData']).its('response.body');
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
                        name: 'PB Products Carousel Mobile',
                        timeout: 60000
                    });
                });
            });
        });
    }
);
