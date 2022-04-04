import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;

describe(
    'PWA-1151: verify slider content',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify slider content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.get('*[class*="banner-content-"]').should('be.visible');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 2', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider2.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 2',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 3', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider3.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 3',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 4', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider4.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 4',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 5', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider5.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 5',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 6', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider6.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 6',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 7', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider7.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 7',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 8', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider8.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 8',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 9', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider9.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 9',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 10', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider10.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 10',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 11', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider11.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 11',
                    timeout: 60000
                });
            });
        });

        it('verify slider content 12', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider12.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Slider Page 12',
                    timeout: 60000
                });
            });
        });
    }
);

describe(
    'PWA-1471: Verify pagebuilder slider media query',
    { tags: ['@commerce', '@open-source', '@ci'] },
    () => {
        it('should apply mediaQuery styles', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/slider/slider-media-query'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Slider media query (Desktop)',
                    timeout: 60000
                });
            });
            cy.viewport('ipad-2');
            cy.captureFullPageScreenshot({
                name: 'Slider media query (Mobile)',
                timeout: 60000
            });
        });
    }
);
