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

        // Row with youtube video in viewport
        cy.get('div[class^="richContent-root"]')
            .eq(0)
            .find('iframe')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'youtube.com');

        // Row with youtube video outside viewport
        cy.get('div[class^="richContent-root"]')
            .eq(8)
            .find('div[class^="richContent-root"]')
            .eq(0)
            .find('iframe')
            .should('not.exist');

        // Scroll to element to test iframe lazy load
        cy.get('div[class^="richContent-root"]')
            .eq(8)
            .find('div[class^="richContent-root"]')
            .eq(0)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .should('exist');

        // Scroll to bottom of the page to load all iframes
        cy.scrollTo('bottom', { duration: 2000 });

        // Hide iframes to prevent capturing moving images
        cy.get('iframe').invoke(
            'attr',
            'style',
            'visibility: hidden !important'
        );

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
