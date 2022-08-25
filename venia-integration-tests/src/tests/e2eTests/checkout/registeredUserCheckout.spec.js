import {
    accountAccess as accountAccessFixtures,
    cartPage as cartPageFixtures,
    checkoutPage as checkoutPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';
import {
    checkoutPage as checkoutPageActions,
    productPage as productPageActions,
    toast as toastActions
} from '../../../actions';
import {
    cartPage as cartPageAssertions,
    checkoutPage as checkoutPageAssertions,
    header as headerAssertions,
    myAccountMenu as myAccountMenuAssertions,
    orderHistoryPage as orderHistoryPageAssertions,
    toast as toastAssertions
} from '../../../assertions';
import { aliasMutation } from '../../../utils/graphql-test-utils';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const { cartPageRoute } = cartPageFixtures;
const { checkoutShippingData, checkoutBillingData } = checkoutPageFixtures;
const {
    productAugustaEarrings,
    productValeriaTwoLayeredTank
} = productPageFixtures;
const {
    getCheckoutDetailsCall,
    getItemsInCartCall,
    getPaymentInformationCall,
    getProductDetailForProductPageCall,
    getProductListingCall,
    getSelectedAndAvailableShippingMethodsCall,
    hitGraphqlPath,
    getIsEmailAvailableCall,
    getCartDetailsAfterAccountCreationCall,
    getCustomerAfterCreateCall
} = graphqlMockedCallsFixtures;

const {
    toggleLoginDialog,
    reviewOrder,
    placeOrder,
    setCustomerShippingAddress,
    editCreditCardInformation,
    setGuestShippingAddress,
    signInFromCheckoutPage
} = checkoutPageActions;
const {
    addToCartFromProductPage,
    selectOptionsFromProductPage,
    setQuantityFromProductPage
} = productPageActions;

const { clickOnToastAction } = toastActions;

const { assertProductInCartPage } = cartPageAssertions;
const {
    assertAddressInShippingInformationInCheckoutPage,
    assertSelectedShippingMethodInCheckoutPage,
    assertPaymentInformationInCheckoutPage,
    assertProductInCheckoutPage
} = checkoutPageAssertions;
const { assertCartTriggerCount } = headerAssertions;
const { assertCreateAccount } = myAccountMenuAssertions;
const {
    assertOrdersCountInOrderDetails,
    assertAddressInformationInOrderDetails,
    assertShippingMethodInOrderDetails,
    assertPaymentMethodInOrderDetails,
    assertProductInOrderDetails
} = orderHistoryPageAssertions;
const { assertToastExists } = toastAssertions;

const completeShippingAddress = {
    ...checkoutShippingData.us,
    firstName,
    lastName
};

describe(
    'PWA-1412: verify registered user checkout actions',
    {
        tags: [
            '@e2e',
            '@commerce',
            '@open-source',
            '@ci',
            '@checkout',
            '@cart',
            '@authuser'
        ]
    },
    () => {
        it('user should be able to place an order as a registered customer', () => {
            cy.intercept('GET', getCheckoutDetailsCall).as(
                'gqlGetCheckoutDetailsQuery'
            );
            cy.intercept('GET', getItemsInCartCall).as(
                'gqlGetItemsInCartQuery'
            );
            cy.intercept('GET', getPaymentInformationCall).as(
                'gqlGetPaymentInformationQuery'
            );
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );
            cy.intercept('GET', getProductListingCall).as(
                'gqlGetProductListingQuery'
            );
            cy.intercept('GET', getSelectedAndAvailableShippingMethodsCall).as(
                'gqlGetSelectedAndAvailableShippingMethodsQuery'
            );
            cy.intercept('GET', getCartDetailsAfterAccountCreationCall).as(
                'gqlGetCartDetailsAfterAccountCreationQuery'
            );
            cy.intercept('GET', getCustomerAfterCreateCall).as(
                'gqlGetCustomerAfterCreateQuery'
            );
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'CreateAccount');
                aliasMutation(req, 'placeOrder');
                aliasMutation(req, 'setBillingAddress');
                aliasMutation(req, 'setSelectedPaymentMethod');
                aliasMutation(req, 'GetCartDetailsAfterAccountCreation');
                aliasMutation(req, 'SignInAfterCreate');
                aliasMutation(req, 'AddProductToCart');
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

            // Test - Create an account in Checkout
            cy.visitCheckoutPage();

            toggleLoginDialog();

            cy.createAccount(
                accountAccessFixtures.firstName,
                lastName,
                accountEmail,
                accountPassword
            );

            cy.wait(['@gqlGetCustomerAfterCreateQuery'], {
                timeout: 60000
            });

            assertCreateAccount(firstName);

            // Test - Add simple product to cart from Product Page
            cy.visit(productAugustaEarrings.url);
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
            assertProductInCartPage(productAugustaEarrings.name);

            // Test - Set Customer Shipping Address
            cy.visitCheckoutPage();

            setCustomerShippingAddress(completeShippingAddress);

            cy.wait(['@gqlGetSelectedAndAvailableShippingMethodsQuery'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(
                completeShippingAddress
            );

            // Test - Edit Payment Information
            cy.wait(['@gqlGetPaymentInformationQuery'], {
                timeout: 60000
            });

            editCreditCardInformation({ ...checkoutBillingData[0] });

            // Test - Review Order
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

            assertAddressInShippingInformationInCheckoutPage(
                completeShippingAddress
            );
            assertSelectedShippingMethodInCheckoutPage();
            assertPaymentInformationInCheckoutPage({
                ...checkoutBillingData[0]
            });
            assertProductInCheckoutPage({
                name: productValeriaTwoLayeredTank.name,
                quantity: 2
            });

            // Test - Place Order
            placeOrder();

            cy.wait(['@gqlplaceOrderMutation', '@gqlGetCheckoutDetailsQuery'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(
                completeShippingAddress,
                true
            );
            assertSelectedShippingMethodInCheckoutPage(undefined, true);
            assertProductInCheckoutPage(
                { name: productValeriaTwoLayeredTank.name, quantity: 2 },
                true
            );
            assertProductInCheckoutPage(
                { name: productAugustaEarrings.name, quantity: 2 },
                true
            );

            // Test - Order History
            cy.visitOrderHistoryPage();

            assertOrdersCountInOrderDetails(1);
            assertAddressInformationInOrderDetails(completeShippingAddress);
            assertAddressInformationInOrderDetails(
                completeShippingAddress,
                true
            );
            assertShippingMethodInOrderDetails();
            assertPaymentMethodInOrderDetails();
            assertProductInOrderDetails(productValeriaTwoLayeredTank.name);
            assertProductInOrderDetails(productAugustaEarrings.name);
        });

        it('Registered user should be able to sign in from toast suggestion in guest checkout page', () => {
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.intercept('GET', getIsEmailAvailableCall).as(
                'gqlGetIsEmailAvailableQuery'
            );

            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'SignIn');
                aliasMutation(req, 'CreateCartAfterSignIn');
                aliasMutation(req, 'MergeCartsAfterSignIn');
            });

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

            cy.visitCheckoutPage();
            setGuestShippingAddress({
                ...completeShippingAddress,
                email: accountEmail
            });

            cy.wait(['@gqlGetIsEmailAvailableQuery'], {
                timeout: 60000
            });

            // Test - Sign in from toast
            assertToastExists();
            clickOnToastAction();

            signInFromCheckoutPage(undefined, accountPassword);

            cy.wait(
                [
                    '@gqlSignInMutation',
                    '@gqlCreateCartAfterSignInMutation',
                    '@gqlMergeCartsAfterSignInMutation'
                ],
                { timeout: 60000 }
            );

            assertCreateAccount(firstName);
        });
    }
);
