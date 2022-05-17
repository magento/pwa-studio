import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    categoryPage as categoryPageFixtures
} from '../../../fixtures';
import { searchFromSearchBar, triggerSearch } from '../../../actions/header';

const { categorySweaters, productCarinaCardigan } = categoryPageFixtures;

const {
    getCMSPage,
    getCategoriesCall,
    getProductDetailForProductPageCall,
    getProductSearchCall,
    getStoreConfigDataCall,
    getAutocompleteResultsCall,
    getStoreConfigDataForGalleryACCall
} = graphqlMockedCallsFixtures;

describe(
    'PWA-2094: Track product impressions and clicks',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@beacon'] },
    () => {
        it('verify products content type', () => {
            cy.intercept('GET', getStoreConfigDataCall, {
                fixture: 'resource/storeConfigAC.json'
            }).as('gqlGetStoreConfigDataQuery');

            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/products/products-carousel-5.json'
            }).as('getCMSMockData');

            cy.visit('/', {
                onBeforeLoad(win) {
                    win.document.addEventListener(
                        'beacon',
                        cy.stub().as('beacon')
                    );
                }
            });
            cy.wait(['@getCMSMockData']).its('response.body');
            // 5 products, currently at 6 because of extra sample data module call.
            cy.get('@beacon')
                .should('have.callCount', 6)
                .its('lastCall.args.0.detail.type')
                .should('equal', 'PRODUCT_IMPRESSION');
            cy.get('.slick-slider')
                .eq(0)
                .scrollIntoView()
                .get('img[loading="lazy"][alt="Silver Amor Bangle Set"]')
                .click();
            cy.get('@beacon')
                .should('have.callCount', 7)
                .its('lastCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        priceTotal: 98,
                        selectedOptions: null,
                        sku: 'VA22-SI-NA'
                    },
                    type: 'PRODUCT_CLICK'
                });
        });

        it('verify category page', () => {
            cy.intercept('GET', getStoreConfigDataCall, {
                fixture: 'resource/storeConfigAC.json'
            }).as('gqlGetStoreConfigDataQuery');
            cy.intercept('GET', getStoreConfigDataForGalleryACCall, {
                fixture: 'gallery/galleryStoreConfigAC.json'
            }).as('gqlGetStoreConfigDataForGallery');
            cy.intercept('GET', getCategoriesCall, {
                fixture: 'categoryPage/productMockCall/productMockResponse.json'
            }).as('gqlGetCategoriesQuery');

            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.visit(categorySweaters, {
                onBeforeLoad(win) {
                    win.document.addEventListener(
                        'beacon',
                        cy.stub().as('beacon')
                    );
                }
            });
            cy.wait(['@gqlGetCategoriesQuery']).its('response.body');
            cy.document().invoke(
                'addEventListener',
                'beacon',
                cy.stub().as('beacon')
            );
            // 12 products, currently at 13 because of extra sample data module call.
            cy.get('@beacon')
                .should('have.callCount', 13)
                .its('lastCall.args.0.detail.type')
                .should('equal', 'PRODUCT_IMPRESSION');
            cy.get(`img[loading="lazy"][alt="${productCarinaCardigan}"]`)
                .scrollIntoView()
                .click();
            cy.get('@beacon')
                .should('have.callCount', 14)
                .its('lastCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        priceTotal: 78,
                        selectedOptions: null,
                        sku: 'VSW01'
                    },
                    type: 'PRODUCT_CLICK'
                });
        });

        it('verify search page', () => {
            cy.intercept('GET', getStoreConfigDataCall, {
                fixture: 'resource/storeConfigAC.json'
            }).as('gqlGetStoreConfigDataQuery');
            cy.intercept('GET', getStoreConfigDataForGalleryACCall, {
                fixture: 'gallery/galleryStoreConfigAC.json'
            }).as('gqlGetStoreConfigDataForGallery');
            cy.intercept('GET', getProductSearchCall, {
                fixture: 'beacon/productSearchMockResponse.json'
            }).as('gqlGetProductSearchQuery');

            cy.visit('./search.html?page=1', {
                onBeforeLoad(win) {
                    win.document.addEventListener(
                        'beacon',
                        cy.stub().as('beacon')
                    );
                }
            });
            cy.wait(['@gqlGetProductSearchQuery']).its('response.body');
            // 2 products, currently at 3 because of extra sample data module call.
            cy.get('@beacon')
                .should('have.callCount', 3)
                .its('lastCall.args.0.detail.type')
                .should('equal', 'PRODUCT_IMPRESSION');
            cy.get(`img[loading="lazy"][alt="Selena Pants"]`)
                .scrollIntoView()
                .click();
            cy.get('@beacon')
                .should('have.callCount', 4)
                .its('lastCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        priceTotal: 108,
                        selectedOptions: null,
                        sku: 'VP01'
                    },
                    type: 'PRODUCT_CLICK'
                });
        });

        it('verify search suggest products', () => {
            cy.intercept('GET', getStoreConfigDataCall, {
                fixture: 'resource/storeConfigAC.json'
            }).as('gqlGetStoreConfigDataQuery');
            cy.intercept('GET', getAutocompleteResultsCall, {
                fixture: 'beacon/productSearchAutocompleteMockResponse.json'
            }).as('gqlGetAutoCompleteResultsQuery');

            cy.visit('/', {
                onBeforeLoad(win) {
                    win.document.addEventListener(
                        'beacon',
                        cy.stub().as('beacon')
                    );
                }
            });
            cy.wait(['@gqlGetStoreConfigDataQuery']).its('response.body');
            triggerSearch();

            searchFromSearchBar('foobar', false);

            cy.wait(['@gqlGetAutoCompleteResultsQuery']).its('response.body');
            // 2 products, currently at 3 because of extra sample data module call.
            cy.get('@beacon')
                .should('have.callCount', 3)
                .its('lastCall.args.0.detail.type')
                .should('equal', 'PRODUCT_IMPRESSION');
            cy.get(`img[loading="lazy"][alt="Selena Pants"]`)
                .scrollIntoView()
                .click();
            cy.get('@beacon')
                .should('have.callCount', 4)
                .its('lastCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        priceTotal: 108,
                        selectedOptions: null,
                        sku: 'VP01'
                    },
                    type: 'PRODUCT_CLICK'
                });
        });
    }
);
