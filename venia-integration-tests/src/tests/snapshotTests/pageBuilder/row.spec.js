import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    mediaMockedCalls as mediaMockedCallsFixtures
} from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
const { successImage } = mediaMockedCallsFixtures;

describe(
    'PWA-1156: verify pagebuilder row content',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify row content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/row/row-1.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            // Scroll to bottom of the page to load all elements
            cy.scrollTo('bottom', { duration: 2000 });
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
            // Scroll to bottom of the page to load all elements
            cy.scrollTo('bottom', { duration: 2000 });
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
            // Scroll to bottom of the page to load all elements
            cy.scrollTo('bottom', { duration: 2000 });
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
            cy.intercept('GET', successImage, {
                fixture:
                    'mediaMockedCalls/images/round-gold-colored-analog-watch-with-pink-leather-strap-on-1162519_sm.png'
            }).as('getVideoFallbackImage');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.wait(['@getVideoFallbackImage']).its('response.body');
            // Row with youtube video in viewport
            cy.get('div[class^="richContent-root"]')
                .eq(0)
                .find('source')
                .should('exist')
                .and('have.attr', 'src')
                .and('contain', 'mockyoutubevideo');

            // Row with youtube video outside viewport
            cy.get('div[class^="richContent-root"]')
                .eq(8)
                .find('div[class^="richContent-root"]')
                .eq(0)
                .find('video')
                .should('not.exist');

            // Scroll to element to test iframe lazy load
            cy.get('div[class^="richContent-root"]')
                .eq(8)
                .find('div[class^="richContent-root"]')
                .eq(0)
                .scrollIntoView({ duration: 2000 })
                .find('video')
                .should('exist');

            // Scroll to bottom of the page to load all rows
            cy.scrollTo('bottom', { duration: 2000 });

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
            cy.intercept('GET', successImage, {
                fixture:
                    'mediaMockedCalls/images/round-gold-colored-analog-watch-with-pink-leather-strap-on-1162519_sm.png'
            }).as('getVideoFallbackImage');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.wait(['@getVideoFallbackImage']).its('response.body');

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

            // Scroll to bottom of the page to load all elements
            cy.scrollTo('bottom', { duration: 2000 });

            // Hide videos to prevent capturing moving images
            cy.get('video')
                .invoke('attr', 'style', 'visibility: hidden !important')
                .should('not.be.visible');

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
                .and('contain', 'youtube');

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
                .and('contain', 'youtube');

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
                .and('contain', 'youtube');

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
            cy.get('iframe, video')
                .invoke('attr', 'style', 'visibility: hidden !important')
                .should('not.be.visible');

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Row Video Background3',
                    timeout: 60000
                });
            });
        });
    }
);

describe(
    'PWA-1471: Verify pagebuilder row media query',
    { tags: ['@commerce', '@open-source', '@ci'] },
    () => {
        it('should apply mediaQuery styles', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/row/row-media-query'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Row media query (Desktop)',
                    timeout: 60000
                });
            });
            cy.viewport('ipad-2');
            cy.captureFullPageScreenshot({
                name: 'Row media query (Mobile)',
                timeout: 60000
            });
        });
    }
);
