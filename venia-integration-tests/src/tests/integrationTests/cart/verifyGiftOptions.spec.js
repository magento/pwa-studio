import {
    cartPage as cartPageFixtures,
    checkoutPage as checkoutPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';
import {
    cartPage as cartPageActions,
    productPage as productPageActions
} from '../../../actions';
import { cartPage as cartPageAssertions } from '../../../assertions';
import { aliasMutation } from '../../../utils/graphql-test-utils';

const { cartPageRoute } = cartPageFixtures;
const { defaultGiftOptionsData } = checkoutPageFixtures;
const {
    getProductDetailForProductPageCall,
    getProductListingCall,
    getGiftOptionsCall,
    getStoreConfigForGiftOptionsCall,
    hitGraphqlPath
} = graphqlMockedCallsFixtures;
const { productValeriaTwoLayeredTank } = productPageFixtures;

const {
    toggleGiftOptionsSection,
    setGiftOptionsFromCartPage
} = cartPageActions;
const {
    addToCartFromProductPage,
    selectOptionsFromProductPage,
    setQuantityFromProductPage
} = productPageActions;

const {
    assertNoGiftOptionsSection,
    assertGiftMessage,
    assertNoGiftReceipt,
    assertNoPrintedCard,
    assertGiftReceipt,
    assertPrintedCard,
    assertCartGiftOptions
} = cartPageAssertions;

describe(
    'verify gift options actions in cart',
    { tags: ['@integration', '@commerce', '@ci', '@cart'] },
    () => {
        it('user should be able to add and update gift options', () => {
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );
            cy.intercept('GET', getProductListingCall).as(
                'gqlGetProductListingQuery'
            );
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'SetGiftOptionsOnCart');
            });

            // Test - Add configurable products to cart from Product Pages
            cy.visit(productValeriaTwoLayeredTank.url);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });

            selectOptionsFromProductPage();
            setQuantityFromProductPage(1);
            addToCartFromProductPage();
            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });

            // Test - No Gift Options are available
            cy.intercept('GET', getStoreConfigForGiftOptionsCall, {
                fixture: 'giftOptions/noGiftOptionsInStore.json'
            }).as('getGiftOptionsEmpty');

            cy.visit(cartPageRoute);
            cy.wait(['@gqlGetProductListingQuery'], {
                timeout: 60000
            });

            assertNoGiftOptionsSection();

            // Test - Only Gift Message is available
            cy.intercept('GET', getStoreConfigForGiftOptionsCall, {
                fixture: 'giftOptions/onlyGiftMessageInStore.json'
            }).as('getGiftOptionsGiftMessageOnly');

            cy.reload();
            cy.wait(['@gqlGetProductListingQuery'], {
                timeout: 60000
            });

            toggleGiftOptionsSection();

            assertGiftMessage();
            assertNoGiftReceipt();
            assertNoPrintedCard();

            // Test - All Gift Options are available
            cy.intercept('GET', getStoreConfigForGiftOptionsCall, {
                fixture: 'giftOptions/allGiftOptionsInStore.json'
            }).as('getGiftOptionsGiftMessageAll1');

            cy.reload();
            cy.wait(['@gqlGetProductListingQuery'], {
                timeout: 60000
            });

            toggleGiftOptionsSection();

            assertGiftMessage();
            assertGiftReceipt();
            assertPrintedCard();

            // Test - Gift Options is in cart
            cy.intercept('GET', getStoreConfigForGiftOptionsCall, {
                fixture: 'giftOptions/allGiftOptionsInStore.json'
            }).as('getGiftOptionsGiftMessageAll2');
            cy.intercept('GET', getGiftOptionsCall, {
                fixture: 'giftOptions/savedGiftOptions.json'
            }).as('getGiftOptionsFromCart');

            cy.reload();
            cy.wait(['@gqlGetProductListingQuery'], {
                timeout: 60000
            });
            cy.wait(['@getGiftOptionsFromCart']).its('response.body');
            cy.wait(['@getGiftOptionsGiftMessageAll2']).its('response.body');

            toggleGiftOptionsSection();

            assertCartGiftOptions(defaultGiftOptionsData[1]);

            // Test - Update Gift Options
            setGiftOptionsFromCartPage({
                ...defaultGiftOptionsData[0],
                shouldEdit: true
            });

            cy.wait(['@gqlSetGiftOptionsOnCartMutation'], {
                timeout: 60000
            });

            assertCartGiftOptions(defaultGiftOptionsData[0]);

            // Test - Remove Gift Options
            setGiftOptionsFromCartPage(defaultGiftOptionsData[2]);

            cy.wait(['@gqlSetGiftOptionsOnCartMutation'], {
                timeout: 60000
            });

            assertCartGiftOptions(defaultGiftOptionsData[2]);
        });
    }
);
