import {
    cartPage as cartPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';
import {
    cartPage as cartPageActions,
    productPage as productPageActions
} from '../../../actions';
import {
    cartPage as cartPageAssertions,
    header as headerAssertions
} from '../../../assertions';
import { aliasMutation } from '../../../utils/graphql-test-utils';

const { cartPageRoute } = cartPageFixtures;
const {
    productCarminaEarrings,
    productValeriaTwoLayeredTank
} = productPageFixtures;
const {
    getProductDetailForProductPageCall,
    getProductListingCall,
    hitGraphqlPath
} = graphqlMockedCallsFixtures;

const { removeProductFromCart } = cartPageActions;
const {
    addToCartFromProductPage,
    selectOptionsFromProductPage,
    setQuantityFromProductPage
} = productPageActions;

const { assertProductInCartPage } = cartPageAssertions;
const { assertCartIsEmpty, assertCartTriggerCount } = headerAssertions;

describe(
    'verify remove item cart action',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@cart'] },
    () => {
        it('user should be able to remove an item from the cart', () => {
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );
            cy.intercept('GET', getProductListingCall).as(
                'gqlGetProductListingQuery'
            );
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'removeItem');
            });

            // Test - Add configurable product to cart from Product Page
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

            // Test - Add simple product to cart from Product Page
            cy.visit(productCarminaEarrings.url);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });

            setQuantityFromProductPage(2);
            addToCartFromProductPage();
            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });

            assertCartTriggerCount(4);

            // Test - Products are in Cart Page
            cy.visit(cartPageRoute);
            cy.wait(['@gqlGetProductListingQuery'], {
                timeout: 60000
            });

            assertProductInCartPage(productValeriaTwoLayeredTank.name);
            assertProductInCartPage(productCarminaEarrings.name);

            // Test - Remove products from Cart
            removeProductFromCart(productValeriaTwoLayeredTank.name);
            cy.wait(['@gqlremoveItemMutation'], {
                timeout: 60000
            });

            assertCartTriggerCount(2);

            removeProductFromCart(productCarminaEarrings.name);
            cy.wait(['@gqlremoveItemMutation'], {
                timeout: 60000
            });

            assertCartIsEmpty();
        });
    }
);
