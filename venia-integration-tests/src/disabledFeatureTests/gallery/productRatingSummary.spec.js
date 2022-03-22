import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';

import { categoryPage as categoryPageAssertions } from '../../../assertions';

const { categorySweaters, productCarinaCardigan } = categoryPageFixtures;

const {
    assertProductIsInGallery,
    assertRatingSummary
} = categoryPageAssertions;

const {
    getCategoriesCall,
    getProductDetailForProductPageCall,
    getStoreConfigDataForGalleryACCall
} = graphqlMockedCallsFixtures;

describe('Verify product Rating Summary', () => {
    it('Rating Summary needs to be rendered on a product on Category Page', () => {
        cy.intercept('GET', getCategoriesCall, {
            fixture: 'categoryPage/productMockCall/productMockResponse.json'
        }).as('gqlGetCategoriesQuery');

        cy.intercept('GET', getProductDetailForProductPageCall).as(
            'gqlGetProductDetailForProductPageQuery'
        );

        cy.intercept('GET', getStoreConfigDataForGalleryACCall).as(
            'gqlGetStoreConfigDataForGallery'
        );

        cy.visit(categorySweaters);

        cy.wait(['@gqlGetCategoriesQuery']);

        assertProductIsInGallery(productCarinaCardigan);

        cy.wait(['@gqlGetStoreConfigDataForGallery']);

        assertRatingSummary(productCarinaCardigan);
    });
});
