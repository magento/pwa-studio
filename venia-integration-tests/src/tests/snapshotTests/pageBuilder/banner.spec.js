import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;

describe(
    'PWA-1154: verify pagebuilder banner content',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify banner content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page',
                    timeout: 60000
                });
            });
        });

        it('verify banner content2', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner2.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page2',
                    timeout: 60000
                });
            });
        });

        it('verify banner content3', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner3.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page3',
                    timeout: 60000
                });
            });
        });

        it('verify banner content4', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner4.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page4',
                    timeout: 60000
                });
            });
        });

        it('verify banner content5', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner5.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page5',
                    timeout: 60000
                });
            });
        });

        it('verify banner content6', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner6.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page6',
                    timeout: 60000
                });
            });
        });

        it('verify banner content7', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner7.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page7',
                    timeout: 60000
                });
            });
        });

        it('verify banner content8', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner8.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page8',
                    timeout: 60000
                });
            });
        });

        it('verify banner content9', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner9.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page9',
                    timeout: 60000
                });
            });
        });

        it('verify banner content10', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner10.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            //Product cache image loading takes time
            cy.wait(5000);
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page10',
                    timeout: 180000
                });
            });
        });
    }
);

describe(
    'PWA-1471: Verify pagebuilder banner media query',
    { tags: ['@commerce', '@open-source', '@ci'] },
    () => {
        it('should apply mediaQuery styles', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/banner/banner-media-query'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Banner media query (Desktop)',
                    timeout: 180000
                });
            });
            cy.viewport('ipad-2');
            cy.captureFullPageScreenshot({
                name: 'Banner media query (Mobile)',
                timeout: 180000
            });
        });
    }
);
