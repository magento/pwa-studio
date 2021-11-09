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
import {
    hasOperationName,
    aliasMutation
} from '../../../utils/graphql-test-utils';

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

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify gift options actions in cart', () => {
    it('user should be able to add and update gift options', () => {
        cy.intercept('GET', getProductDetailForProductPageCall).as(
            'gqlGetProductDetailForProductPageQuery'
        );
        cy.intercept('GET', getProductListingCall).as(
            'gqlGetProductListingQuery'
        );
        cy.intercept('POST', hitGraphqlPath, req => {
            aliasMutation(req, 'AddProductToCart');
        });
        cy.intercept('POST', hitGraphqlPath, req => {
            if (hasOperationName(req, 'SetGiftOptionsOnCart')) {
                req.alias = 'gqlSetGiftOptionsOnCartMutation';
                // Stop mutation and return variables
                req.reply({
                    data: req.body.variables
                });
            }
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
        cy.wait(['@getGiftOptionsGiftMessageAll2']).its('response.body');
        cy.wait(['@getGiftOptionsFromCart']).its('response.body');

        toggleGiftOptionsSection();

        assertCartGiftOptions(defaultGiftOptionsData[1]);

        // Test - Update Gift Options
        setGiftOptionsFromCartPage(defaultGiftOptionsData[0]);

        cy.wait(['@gqlSetGiftOptionsOnCartMutation'], {
            timeout: 60000
        })
            .its('response.body.data')
            .should(giftOptions => {
                expect(giftOptions.giftReceiptIncluded).to.equal(
                    defaultGiftOptionsData[0].includeGiftReceipt
                );
                expect(giftOptions.printedCardIncluded).to.equal(
                    defaultGiftOptionsData[0].includePrintedCard
                );
                expect(giftOptions.giftMessage.to).to.equal(
                    defaultGiftOptionsData[0].cardTo
                );
                expect(giftOptions.giftMessage.from).to.equal(
                    defaultGiftOptionsData[0].cardFrom
                );
                expect(giftOptions.giftMessage.message).to.equal(
                    defaultGiftOptionsData[0].cardMessage
                );
            });
    });
});
