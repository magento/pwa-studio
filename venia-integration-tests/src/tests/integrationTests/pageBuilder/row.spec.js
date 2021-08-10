import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;

describe('verify pagebuilder row content', () => {
    it('verify row content', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/row/row-1.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Row',
                timeout: 60000
            });
        });
    });

    it('verify row content2', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/row/row-2.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Row2',
                timeout: 60000
            });
        });
    });

    it('verify row min height', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/row/row-min-height.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Row Min Height',
                timeout: 60000
            });
        });
    });

    it('verify row video background', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/row/row-video-background-1.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Row Video Background',
                timeout: 60000
            });
        });
    });

    it('verify row video background2', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/row/row-video-background-2.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Row Video Background2',
                timeout: 60000
            });
        });
    });

    it('verify row video background3', () => {
        cy.intercept('GET', getCMSPage, {
            fixture: 'pageBuilder/row/row-video-background-3.json'
        }).as('getCMSMockData');
        cy.visitHomePage();
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Row Video Background3',
                timeout: 60000
            });
        });
    });
});
