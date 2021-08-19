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

        // Row with mp4 video
        cy.get('div[class^="richContent-root"]')
            .eq(1)
            .scrollIntoView({ duration: 2000 })
            .find('[id^="jarallax-container"] video')
            .should('exist')
            .find('source')
            .should('exist')
            .and('have.attr', 'type')
            .and('contain', 'video/mp4');

        // Row with fallback image
        cy.get('div[class^="richContent-root"]')
            .eq(4)
            .scrollIntoView({ duration: 2000 })
            .find('[id^="jarallax-container"] img')
            .should('exist');

        // Row with active videos
        cy.get('div[class^="richContent-root"]')
            .eq(7)
            .scrollIntoView({ duration: 2000 })
            .find('[id^="jarallax-container"] video')
            .should('exist')
            .find('source')
            .should('exist')
            .and('have.attr', 'type')
            .and('contain', 'video/mp4');

        cy.get('div[class^="richContent-root"]')
            .eq(7)
            .find('[id^="jarallax-container"] video source')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Scroll to bottom of the page to load all elements
        cy.scrollTo('bottom', { duration: 2000 });

        // Hide videos to prevent capturing moving images
        cy.get('video').invoke(
            'attr',
            'style',
            'visibility: hidden !important'
        );

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

        // Row with youtube embedded
        cy.get('div[class^="richContent-root"]')
            .eq(0)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'youtube.com');

        cy.get('div[class^="richContent-root"]')
            .eq(0)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Row with youtube not embedded
        cy.get('div[class^="richContent-root"]')
            .eq(1)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'youtube.com');

        cy.get('div[class^="richContent-root"]')
            .eq(1)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Row with youtube insecure
        cy.get('div[class^="richContent-root"]')
            .eq(2)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'youtube.com');

        cy.get('div[class^="richContent-root"]')
            .eq(2)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Row with vimeo embedded
        cy.get('div[class^="richContent-root"]')
            .eq(3)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'player.vimeo.com');

        cy.get('div[class^="richContent-root"]')
            .eq(3)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Row with vimeo not embedded
        cy.get('div[class^="richContent-root"]')
            .eq(4)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'player.vimeo.com');

        cy.get('div[class^="richContent-root"]')
            .eq(4)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Row with vimeo insecure
        cy.get('div[class^="richContent-root"]')
            .eq(5)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'player.vimeo.com');

        cy.get('div[class^="richContent-root"]')
            .eq(5)
            .scrollIntoView({ duration: 2000 })
            .find('iframe')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Row with mp4
        cy.get('div[class^="richContent-root"]')
            .eq(6)
            .scrollIntoView({ duration: 2000 })
            .find('[id^="jarallax-container"] video')
            .should('exist')
            .find('source')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'https://');
        cy.get('div[class^="richContent-root"]')
            .eq(6)
            .find('[id^="jarallax-container"] video source')
            .and('have.attr', 'type')
            .and('contain', 'video/mp4');

        cy.get('div[class^="richContent-root"]')
            .eq(6)
            .find('[id^="jarallax-container"] video source')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Row with mp4 insecure
        cy.get('div[class^="richContent-root"]')
            .eq(7)
            .scrollIntoView({ duration: 2000 })
            .find('[id^="jarallax-container"] video')
            .should('exist')
            .find('source')
            .should('exist')
            .and('have.attr', 'src')
            .and('contain', 'http://');
        cy.get('div[class^="richContent-root"]')
            .eq(7)
            .find('[id^="jarallax-container"] video source')
            .and('have.attr', 'type')
            .and('contain', 'video/mp4');

        cy.get('div[class^="richContent-root"]')
            .eq(7)
            .find('[id^="jarallax-container"] video source')
            .invoke('attr', 'src')
            .then(src => {
                cy.request(src)
                    .its('status')
                    .should('eq', 200);
            });

        // Hide iframes to prevent capturing moving images
        cy.get('iframe, video').invoke(
            'attr',
            'style',
            'visibility: hidden !important'
        );

        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Row Video Background3',
                timeout: 60000
            });
        });
    });
});
