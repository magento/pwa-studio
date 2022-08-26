import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';

import { categoryPage as categoryPageActions } from '../../../actions';

import { header as headerAssertions } from '../../../assertions';

import { aliasMutation } from '../../../utils/graphql-test-utils';

const { categorySweaters, categoryJewelry } = categoryPageFixtures;

const { carinaCardigan, silverAmorBangleSet } = productPageFixtures;

const { addProductToCartFromCategoryPage } = categoryPageActions;

const { assertCartIsEmpty, assertCartTriggerCount } = headerAssertions;

const {
    getCategoriesCall,
    getProductDetailForProductPageCall,
    hitGraphqlPath,
    getStoreConfigDataForGalleryACCall
} = graphqlMockedCallsFixtures;

describe(
    'Verify Add to Cart actions on category page',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@cart'] },
    () => {
        it("User shouldn't be able to add a CustomizableProduct from category page", () => {
            cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');

            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
            });

            cy.intercept('GET', getStoreConfigDataForGalleryACCall).as(
                'gqlGetStoreConfigDataForGallery'
            );

            cy.visit(categorySweaters);
            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            cy.wait(['@gqlGetStoreConfigDataForGallery'], {
                timeout: 60000
            });

            addProductToCartFromCategoryPage(carinaCardigan.name);

            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });
            cy.checkUrlPath(carinaCardigan.url);

            assertCartIsEmpty();
            cy.visit(categoryJewelry);

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });
            addProductToCartFromCategoryPage(silverAmorBangleSet.name);

            assertCartTriggerCount(1);
        });
    }
);
