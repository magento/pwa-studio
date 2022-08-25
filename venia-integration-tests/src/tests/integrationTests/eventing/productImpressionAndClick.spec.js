import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    categoryPage as categoryPageFixtures
} from '../../../fixtures';
import { searchFromSearchBar, triggerSearch } from '../../../actions/header';

const { categorySweaters } = categoryPageFixtures;

const {
    getCMSPage,
    getCategoriesCall,
    getProductDetailForProductPageCall,
    getProductSearchCall,
    getAutocompleteResultsCall
} = graphqlMockedCallsFixtures;

describe(
    'PWA-2094: Track product impressions and clicks',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@eventing'] },
    () => {
        it('verify products content type', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/products/products-carousel-5.json'
            }).as('getCMSMockData');

            const impressions = [];

            cy.visit('/', {
                onBeforeLoad(win) {
                    win.document.addEventListener('eventing', event => {
                        if (event.detail.type === 'PRODUCT_IMPRESSION') {
                            impressions.push(event);
                        }
                    });
                    win.document.addEventListener(
                        'eventing',
                        cy.stub().as('eventing')
                    );
                }
            });

            cy.wait(['@getCMSMockData']).its('response.body');
            cy.get('.slick-slider').scrollIntoView();

            cy.get('@eventing')
                .its('callCount')
                .should('gte', 5)
                .then(() => {
                    cy.wait(1000).then(() => {
                        expect(impressions.length).eql(5);
                    });
                });

            cy.get('.slick-slider .slick-dots button')
                .eq(1)
                .click();

            cy.get('@eventing')
                .its('callCount')
                .should('gte', 10)
                .then(() => {
                    cy.wait(1000).then(() => {
                        expect(impressions.length).eql(10);
                    });
                });
            cy.get('.slick-slider .slick-dots button')
                .eq(0)
                .click();
            cy.get('@eventing')
                .its('callCount')
                .should('gte', 10)
                .then(() => {
                    cy.wait(1000).then(() => {
                        expect(impressions.length).eql(10);
                    });
                });
            cy.get('.slick-slider')
                .eq(0)
                .scrollIntoView();

            cy.get(
                'a[data-cy="GalleryItem-name"][href$="/silver-amor-bangle-set.html"]'
            )
                .should('be.visible')
                .click();

            cy.get('@eventing')
                .its('lastCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        name: 'Silver Amor Bangle Set',
                        priceTotal: 98,
                        selectedOptions: null,
                        sku: 'VA22-SI-NA'
                    },
                    type: 'PRODUCT_CLICK'
                });
        });

        it('verify category page', () => {
            cy.intercept('GET', getCategoriesCall, {
                fixture: 'categoryPage/productMockCall/productMockResponse.json'
            }).as('gqlGetCategoriesQuery');

            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            const impressions = [];

            cy.visit(categorySweaters, {
                onBeforeLoad(win) {
                    win.document.addEventListener('eventing', event => {
                        if (event.detail.type === 'PRODUCT_IMPRESSION') {
                            impressions.push(event);
                        }
                    });
                    win.document.addEventListener(
                        'eventing',
                        cy.stub().as('eventing')
                    );
                }
            });

            cy.wait(['@gqlGetCategoriesQuery']).its('response.body');
            // 3 products immediate on screen
            cy.get('@eventing')
                .its('callCount')
                .should('gte', 3)
                .then(() => {
                    cy.wait(1000).then(() => {
                        expect(impressions.length).eql(3);
                    });
                });
            cy.scrollTo('bottom');
            // Scroll fast to not activate the middle products and show the last 3 products
            cy.get('@eventing')
                .its('callCount')
                .should('gte', 6)
                .then(() => {
                    cy.wait(1000).then(() => {
                        expect(impressions.length).eql(6);
                    });
                });
            // Slow scroll to see the rest of the 6 products
            cy.scrollTo('top', { duration: 5000 });
            // seen all 12
            // seen all 12
            cy.get('@eventing')
                .its('callCount')
                .should('gte', 12)
                .then(() => {
                    cy.wait(1000).then(() => {
                        expect(impressions.length).eql(12);
                    });
                });
            cy.get(
                'a[data-cy="GalleryItem-name"][href$="/carina-cardigan.html"]'
            )
                .scrollIntoView()
                .click();
            cy.get('@eventing')
                .its('lastCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        name: 'Carina Cardigan',
                        priceTotal: 78,
                        selectedOptions: null,
                        sku: 'VSW01'
                    },
                    type: 'PRODUCT_CLICK'
                });
        });

        it('verify search page', () => {
            cy.intercept('GET', getProductSearchCall, {
                fixture: 'eventing/productSearchMockResponse.json'
            }).as('gqlGetProductSearchQuery');

            const impressions = [];

            cy.visit('./search.html?page=1', {
                onBeforeLoad(win) {
                    win.document.addEventListener('eventing', event => {
                        if (event.detail.type === 'PRODUCT_IMPRESSION') {
                            impressions.push(event);
                        }
                    });
                    win.document.addEventListener(
                        'eventing',
                        cy.stub().as('eventing')
                    );
                }
            });

            cy.wait(['@gqlGetProductSearchQuery']).its('response.body');

            // see 2 products
            cy.get('@eventing')
                .its('callCount')
                .should('gte', 2)
                .then(() => {
                    cy.wait(1000).then(() => {
                        expect(impressions.length).eql(2);
                    });
                });

            cy.get('a[data-cy="GalleryItem-name"][href$="/selena-pants.html"]')
                .scrollIntoView()
                .click();

            cy.get('@eventing')
                .its('lastCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        name: 'Selena Pants',
                        priceTotal: 108,
                        selectedOptions: null,
                        sku: 'VP01'
                    },
                    type: 'PRODUCT_CLICK'
                });
        });

        it('verify search suggest products', () => {
            cy.intercept('GET', getAutocompleteResultsCall, {
                fixture: 'eventing/productSearchAutocompleteMockResponse.json'
            }).as('gqlGetAutoCompleteResultsQuery');
            cy.intercept('GET', getCMSPage, {
                fixture: 'resource/emptyCMSPage.json'
            }).as('getCMSMockData');

            const impressions = [];

            cy.visit('/', {
                onBeforeLoad(win) {
                    win.document.addEventListener('eventing', event => {
                        if (event.detail.type === 'PRODUCT_IMPRESSION') {
                            impressions.push(event);
                        }
                    });
                    win.document.addEventListener(
                        'eventing',
                        cy.stub().as('eventing')
                    );
                }
            });

            cy.wait(['@getCMSMockData']).its('response.body');

            triggerSearch();

            searchFromSearchBar('foobar', false);

            cy.wait(['@gqlGetAutoCompleteResultsQuery']).its('response.body');

            // see 2 products
            cy.get('@eventing')
                .its('callCount')
                .should('gte', 2)
                .then(() => {
                    cy.wait(1000).then(() => {
                        expect(impressions.length).eql(2);
                    });
                });

            cy.get('a[href$="/selena-pants.html"]')
                .scrollIntoView()
                .click();
            cy.get('@eventing')
                .its('lastCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        name: 'Selena Pants',
                        priceTotal: 108,
                        selectedOptions: null,
                        sku: 'VP01'
                    },
                    type: 'PRODUCT_CLICK'
                });
        });
    }
);
