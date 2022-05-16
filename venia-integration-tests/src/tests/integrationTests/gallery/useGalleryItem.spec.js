import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    categoryPage as categoryPageFixtures
} from '../../../fixtures';

const { categorySweaters, productCarinaCardigan } = categoryPageFixtures;

const {
    getCMSPage,
    getCategoriesCall,
    getProductDetailForProductPageCall,
    getProductSearchCall
} = graphqlMockedCallsFixtures;

describe(
    'PWA-2094: Track product impressions and clicks',
    { tags: ['@commerce', '@open-source', '@ci', '@pagebuilder', '@beacon'] },
    () => {
        it('verify products content type', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/products/products-carousel-5.json'
            }).as('getCMSMockData');

            cy.visitHomePage();
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.document().invoke(
                'addEventListener',
                'beacon',
                cy.stub().as('beacon')
            );
            cy.get('.slick-slider')
                .eq(0)
                .scrollIntoView()
                .get('img[loading="lazy"][alt="Silver Amor Bangle Set"]')
                .click();
            cy.get('@beacon')
                .should('have.been.calledOnce')
                .its('firstCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        priceTotal: 98,
                        selectedOptions: null,
                        sku: 'VA22-SI-NA'
                    },
                    type: 'PRODUCT_IMPRESSION'
                });
        });

        it('verify category page', () => {
            cy.intercept('GET', getCategoriesCall, {
                fixture: 'categoryPage/productMockCall/productMockResponse.json'
            }).as('gqlGetCategoriesQuery');

            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.visit(categorySweaters);
            cy.wait(['@gqlGetCategoriesQuery']).its('response.body');
            cy.document().invoke(
                'addEventListener',
                'beacon',
                cy.stub().as('beacon')
            );
            cy.get(`img[loading="lazy"][alt="${productCarinaCardigan}"]`)
                .scrollIntoView()
                .click();
            cy.get('@beacon')
                .its('firstCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        priceTotal: 78,
                        selectedOptions: null,
                        sku: 'VSW01'
                    },
                    type: 'PRODUCT_IMPRESSION'
                });
        });

        it('verify search page', () => {
            cy.intercept('GET', getProductSearchCall, {
                fixture: 'gallery/productSearchMockResponse.json'
            }).as('gqlGetProductSearchQuery');

            cy.visit('./search.html?page=1');
            cy.wait(['@gqlGetProductSearchQuery']).its('response.body');
            cy.document().invoke(
                'addEventListener',
                'beacon',
                cy.stub().as('beacon')
            );
            cy.get(`img[loading="lazy"][alt="Selena Pants"]`)
                .scrollIntoView()
                .click();
            cy.get('@beacon')
                .its('firstCall.args.0.detail')
                .should('deep.equal', {
                    payload: {
                        currencyCode: 'USD',
                        discountAmount: 0,
                        priceTotal: 108,
                        selectedOptions: null,
                        sku: 'VP01'
                    },
                    type: 'PRODUCT_IMPRESSION'
                });
        });
    }
);
