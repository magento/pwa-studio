import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    googleMapApi as googleMapApiFixtures
} from '../../../fixtures';
const { getCMSPage } = graphqlMockedCallsFixtures;
const { createGoogleMapApi } = googleMapApiFixtures;

describe(
    'PWA-1172: verify pagebuilder map content is rendered correctly',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify google map api load with content', () => {
            // Prevent default Google API from loading
            cy.intercept('https://maps.googleapis.com/maps/api/js?*', {});

            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/map/map1.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Verify Map - All content',
                    timeout: 60000
                });
            });
        });

        it('verify mocked google map api with two markers and click event', () => {
            const googleApi = {
                map: {},
                latLng: [],
                marker: [],
                infoWindow: []
            };

            // Prevent default Google API from loading
            cy.intercept('https://maps.googleapis.com/maps/api/js?*', {});

            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/map/map2.json'
            }).as('getCMSMockData');
            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            //Allow map frames to load
            cy.wait(5000);
            cy.window().then(win => {
                // Create a Google API Mock window object
                win.google = createGoogleMapApi(googleApi);
                // Give the Google API Mock to the Map component
                win['__googleMapsApiOnLoadCallback'](win.google.maps);
            });

            // Validate that the Google API Mock is ready to use
            cy.wrap(googleApi)
                .its('map')
                .should('not.be.undefined')
                .and('not.eq', {});

            cy.wrap(googleApi)
                .its('marker')
                .should('have.length', 2);

            cy.get('.cp-marker-element')
                .first()
                .click();

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Verify Map - 2 Locations',
                    timeout: 60000
                });
            });
        });
    }
);
