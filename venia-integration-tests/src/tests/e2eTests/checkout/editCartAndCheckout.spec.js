import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures,
    checkoutPage as checkoutPageFixtures
} from '../../../fixtures';
import {
    header as headerAssertions,
    cartPage as cartPageAssertions,
    checkoutPage as checkoutPageAssertions
} from '../../../assertions';
import {
    productPage as productPageActions,
    miniCart as miniCartActions,
    cartPage as cartPageActions,
    checkoutPage as checkoutPageActions
} from '../../../actions';
import { hitGraphqlPath } from '../../../fixtures/graphqlMockedCalls';
import { aliasMutation } from '../../../utils/graphql-test-utils';
import { openEditShippingMethodDialog } from '../../../actions/checkoutPage';

const {
    setProductColorOption,
    setProductSizeOption,
    setQuantityFromProductPage,
    addToCartFromProductPage
} = productPageActions;
const { triggerMiniCart, goToCartPageFromEditCartButton } = miniCartActions;
const {
    setGuestShippingAddress,
    submitShippingMethod,
    editCreditCardInformation,
    reviewOrder,
    openEditShippingInformationDialog,
    selectShippingMethod,
    openEditPaymentInformationDialog,
    toggleBillingAddressForm,
    editBillingAddress,
    placeOrder
} = checkoutPageActions;
const {
    openProductKebabMenu,
    openProductEditMenu,
    editProductColor,
    editProductSize,
    increaseProductQuantity,
    clickOnUpdateCart,
    goToCheckout
} = cartPageActions;
const { assertCartTriggerCount } = headerAssertions;
const {
    assertKebabMenuExists,
    assertProductInCartPage,
    assertUpdatedProductColorExists,
    assertUpdatedProductPriceExists,
    assertUpdatedProductQuantityExists,
    assertUpdatedProductSizeExists
} = cartPageAssertions;
const {
    assertCheckoutHasGuestHeader,
    assertAddressInShippingInformationInCheckoutPage,
    assertSelectedShippingMethodInCheckoutPage,
    assertOrderSummaryInCheckoutPage,
    assertSignInButtonExists,
    assertSignInButtonNotExist,
    assertProductInCheckoutPage,
    assertPaymentInformationInCheckoutPage,
    assertBillingInformationInCheckoutPage,
    assertOrderConfirmationHeadingInCheckoutPage
} = checkoutPageAssertions;
const { productValeriaTwoLayeredTank } = productPageFixtures;
const {
    getProductDetailForProductPageCall,
    getProductListingCall,
    getSelectedAndAvailableShippingMethodsCall,
    getPaymentInformationCall,
    getItemsInCartCall,
    getCheckoutDetailsCall
} = graphqlMockedCallsFixtures;
const {
    checkoutCustomer1,
    checkoutBillingData,
    checkoutCustomer2,
    fixedShippingMethod,
    checkoutCustomer3
} = checkoutPageFixtures;

describe(
    'PWA-1414: Verify cart editing and checkout',
    {
        tags: ['@e2e', '@commerce', '@open-source', '@ci', '@checkout', '@cart']
    },
    () => {
        it('should be able to edit a configurable product and place an order', () => {
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.intercept('GET', getProductListingCall).as(
                'gqlGetProductListingQuery'
            );

            cy.intercept('GET', getSelectedAndAvailableShippingMethodsCall).as(
                'gqlGetSelectedAndAvailableShippingMethodsQuery'
            );

            cy.intercept('GET', getPaymentInformationCall).as(
                'gqlGetPaymentInformationQuery'
            );
            cy.intercept('GET', getItemsInCartCall).as(
                'gqlGetItemsInCartQuery'
            );
            cy.intercept('GET', getCheckoutDetailsCall).as(
                'gqlGetCheckoutDetailsQuery'
            );

            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'UpdateConfigurableOptions');
                aliasMutation(req, 'SetShippingMethod');
                aliasMutation(req, 'setBillingAddress');
                aliasMutation(req, 'setSelectedPaymentMethod');
                aliasMutation(req, 'SetGuestShipping');
                aliasMutation(req, 'placeOrder');
            });

            cy.visitHomePage();

            cy.visit(productValeriaTwoLayeredTank.url);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });

            setProductColorOption(productValeriaTwoLayeredTank.color);
            setProductSizeOption(productValeriaTwoLayeredTank.size);
            setQuantityFromProductPage(productValeriaTwoLayeredTank.qty);
            addToCartFromProductPage();

            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });

            assertCartTriggerCount(2);
            triggerMiniCart();
            goToCartPageFromEditCartButton();

            cy.wait(['@gqlGetProductListingQuery'], { timeout: 60000 });

            openProductKebabMenu(productValeriaTwoLayeredTank.name);
            openProductEditMenu(productValeriaTwoLayeredTank.name);

            editProductColor(productValeriaTwoLayeredTank.color1);
            editProductSize(productValeriaTwoLayeredTank.size1);
            increaseProductQuantity();
            clickOnUpdateCart();

            cy.wait(['@gqlUpdateConfigurableOptionsMutation'], {
                timeout: 60000
            });

            assertProductInCartPage(productValeriaTwoLayeredTank.name);
            assertKebabMenuExists(productValeriaTwoLayeredTank.name);
            assertUpdatedProductColorExists(
                productValeriaTwoLayeredTank.name,
                productValeriaTwoLayeredTank.color1
            );
            assertUpdatedProductSizeExists(
                productValeriaTwoLayeredTank.name,
                productValeriaTwoLayeredTank.size1
            );
            assertUpdatedProductPriceExists(
                productValeriaTwoLayeredTank.name,
                productValeriaTwoLayeredTank.price
            );
            assertUpdatedProductQuantityExists(
                productValeriaTwoLayeredTank.name,
                3
            );

            goToCheckout();
            assertCheckoutHasGuestHeader();
            assertSignInButtonExists();
            setGuestShippingAddress(checkoutCustomer1);
            cy.wait(['@gqlGetSelectedAndAvailableShippingMethodsQuery'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(checkoutCustomer1);
            submitShippingMethod();
            cy.wait(
                [
                    '@gqlSetShippingMethodMutation',
                    '@gqlGetPaymentInformationQuery'
                ],
                { timeout: 60000 }
            );

            editCreditCardInformation({ ...checkoutBillingData[0] });

            reviewOrder();

            cy.wait(
                [
                    '@gqlsetBillingAddressMutation',
                    '@gqlGetItemsInCartQuery',
                    '@gqlsetSelectedPaymentMethodMutation'
                ],
                {
                    timeout: 60000
                }
            );

            assertCheckoutHasGuestHeader();
            assertSignInButtonNotExist();
            assertOrderSummaryInCheckoutPage();
            assertAddressInShippingInformationInCheckoutPage(checkoutCustomer1);
            assertSelectedShippingMethodInCheckoutPage();
            assertPaymentInformationInCheckoutPage({
                ...checkoutBillingData[0]
            });
            assertProductInCheckoutPage({
                name: productValeriaTwoLayeredTank.name,
                color: productValeriaTwoLayeredTank.color1,
                size: productValeriaTwoLayeredTank.size1,
                quantity: productValeriaTwoLayeredTank.qty1
            });

            openEditShippingInformationDialog();
            setGuestShippingAddress(checkoutCustomer2);

            cy.wait(['@gqlSetGuestShippingMutation'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(checkoutCustomer2);

            openEditShippingMethodDialog();
            selectShippingMethod(fixedShippingMethod);
            submitShippingMethod(true);

            cy.wait(['@gqlSetShippingMethodMutation'], {
                timeout: 60000
            });

            assertSelectedShippingMethodInCheckoutPage(fixedShippingMethod);

            openEditPaymentInformationDialog();

            editCreditCardInformation({ ...checkoutBillingData[1] });
            toggleBillingAddressForm();
            editBillingAddress(checkoutCustomer3);

            cy.wait(
                [
                    '@gqlsetBillingAddressMutation',
                    '@gqlsetSelectedPaymentMethodMutation'
                ],
                {
                    timeout: 60000
                }
            );

            assertPaymentInformationInCheckoutPage({
                ...checkoutBillingData[1]
            });
            assertBillingInformationInCheckoutPage(checkoutCustomer3);

            placeOrder();

            cy.wait(['@gqlplaceOrderMutation', '@gqlGetCheckoutDetailsQuery'], {
                timeout: 60000
            });

            assertOrderConfirmationHeadingInCheckoutPage();
            assertAddressInShippingInformationInCheckoutPage(
                checkoutCustomer2,
                true
            );
            assertSelectedShippingMethodInCheckoutPage(
                fixedShippingMethod,
                true
            );
            assertProductInCheckoutPage(
                {
                    name: productValeriaTwoLayeredTank.name,
                    color: productValeriaTwoLayeredTank.color1,
                    size: productValeriaTwoLayeredTank.size1,
                    quantity: productValeriaTwoLayeredTank.qty1
                },
                true
            );
        });
    }
);
