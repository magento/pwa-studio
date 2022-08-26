import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';
import {
    productPage as productPageActions,
    miniCart as miniCartActions
} from '../../../actions';

import {
    header as headerAssertions,
    miniCart as miniCartAssertions
} from '../../../assertions';

import { aliasMutation } from '../../../utils/graphql-test-utils';

const {
    getProductDetailForProductPageCall,
    hitGraphqlPath
} = graphqlMockedCallsFixtures;

const {
    productCarminaEarrings,
    productValeriaTwoLayeredTank
} = productPageFixtures;

const {
    addToCartFromProductPage,
    selectOptionsFromProductPage,
    setQuantityFromProductPage
} = productPageActions;

const { triggerMiniCart, removeProductFromMiniCart } = miniCartActions;

const { assertCartEmptyMessage, assertProductInList } = miniCartAssertions;

const { assertCartIsEmpty, assertCartTriggerCount } = headerAssertions;

describe(
    'PWA-1398: verify mini cart actions',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@cart'] },
    () => {
        it('user should be able to remove products', () => {
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
            });

            // Add configurable product to cart
            cy.visit(productValeriaTwoLayeredTank.url);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });
            selectOptionsFromProductPage();
            setQuantityFromProductPage(2);
            addToCartFromProductPage();
            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });
            assertCartTriggerCount(2);

            // Add simple product to cart
            cy.visit(productCarminaEarrings.url);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });
            setQuantityFromProductPage();
            addToCartFromProductPage();
            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });
            assertCartTriggerCount(3);

            // Open mini cart
            triggerMiniCart();

            // Verify both products are in mini cart
            assertProductInList(productValeriaTwoLayeredTank.name);
            assertProductInList(productCarminaEarrings.name);

            // Remove simple product
            removeProductFromMiniCart(1);
            assertCartTriggerCount(2);

            // Remove configurable product
            removeProductFromMiniCart();

            // Verify cart is empty again
            assertCartIsEmpty();
            assertCartEmptyMessage();
        });
    }
);
