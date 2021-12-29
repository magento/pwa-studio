import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';

import { categoryPage as categoryPageActions } from '../../../actions';

import { header as headerAssertions } from '../../../assertions';

const { categorySweaters, categoryJewelry } = categoryPageFixtures;

const { carinaCardigan, silverAmorBangleSet } = productPageFixtures;

const { addProductToCartFromCategoryPage } = categoryPageActions;

const { assertCartIsEmpty, assertCartTriggerCount } = headerAssertions;

const {
    getCategoriesCall,
    getProductDetailForProductPageCall
} = graphqlMockedCallsFixtures;

describe('Verify Cart actions', () => {
    it("User shouldn't be able to add a CustomizableProduct from category page", () => {
        cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');

        cy.intercept('GET', getProductDetailForProductPageCall).as(
            'gqlGetProductDetailForProductPageQuery'
        );

        cy.visit(categorySweaters);
        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        addProductToCartFromCategoryPage(carinaCardigan.name);
        cy.visit(carinaCardigan.url);
        cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
            timeout: 60000
        });
        assertCartIsEmpty();
        cy.visit(categoryJewelry);

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });
        addProductToCartFromCategoryPage(silverAmorBangleSet.name);
        cy.visit(silverAmorBangleSet.url);
        assertCartTriggerCount(1);
    });
});
