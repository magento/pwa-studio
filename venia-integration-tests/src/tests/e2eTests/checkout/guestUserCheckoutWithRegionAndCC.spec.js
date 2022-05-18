import {
    accountAccess as accountAccessFixtures,
    cartPage as cartPageFixtures,
    checkoutPage as checkoutPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    myAccountMenu as myAccountMenuFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';
import {
    cartPage as cartPageActions,
    checkoutPage as checkoutPageActions,
    myAccountMenu as myAccountMenuActions,
    productPage as productPageActions
} from '../../../actions';
import {
    accountInformationPage as accountInformationPageAssertions,
    cartPage as cartPageAssertions,
    checkoutPage as checkoutPageAssertions,
    header as headerAssertions,
    myAccountMenu as myAccountMenuAssertions
} from '../../../assertions';
import { aliasMutation } from '../../../utils/graphql-test-utils';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const { cartPageRoute } = cartPageFixtures;
const {
    checkoutBillingData,
    checkoutShippingData,
    defaultShippingMethods
} = checkoutPageFixtures;
const { accountInformationPage } = myAccountMenuFixtures;
const {
    getCheckoutDetailsCall,
    getCountriesCall,
    getCustomerAfterCheckoutCall,
    getItemsInCartCall,
    getPaymentInformationCall,
    getProductDetailForProductPageCall,
    getProductListingCall,
    getRegionsCall,
    getSelectedAndAvailableShippingMethodsCall,
    getShippingMethodsCall,
    hitGraphqlPath
} = graphqlMockedCallsFixtures;
const {
    productIsadoraSkirt,
    productValeriaTwoLayeredTank
} = productPageFixtures;

const {
    toggleShippingMethodSection,
    toggleShippingMethodEstimate,
    estimateShippingMethod,
    selectShippingMethodFromCartPage
} = cartPageActions;
const {
    reviewOrder,
    placeOrder,
    setGuestShippingAddress,
    editCreditCardInformation,
    createAccountFromOrderConfirmationPage
} = checkoutPageActions;
const { goToMyAccount } = myAccountMenuActions;
const {
    addToCartFromProductPage,
    selectOptionsFromProductPage,
    setQuantityFromProductPage
} = productPageActions;

const { assertAccountInformationHeading } = accountInformationPageAssertions;
const { assertProductInCartPage } = cartPageAssertions;
const {
    assertAddressInShippingInformationInCheckoutPage,
    assertSelectedShippingMethodInCheckoutPage,
    assertProductInCheckoutPage
} = checkoutPageAssertions;
const { assertCartTriggerCount } = headerAssertions;
const { assertCreateAccount } = myAccountMenuAssertions;

const completeShippingAddress = {
    ...checkoutShippingData.gb,
    email: accountEmail,
    firstName,
    lastName
};

describe(
    'PWA-1870: verify uk region checkout actions',
    {
        tags: ['@e2e', '@commerce', '@open-source', '@ci', '@checkout', '@cart']
    },
    () => {
        it('user should be able to place an order as a guest with an specified Region and a credit card', () => {
            cy.intercept('GET', getCheckoutDetailsCall).as(
                'gqlGetCheckoutDetailsQuery'
            );
            cy.intercept('GET', getCountriesCall).as('gqlGetCountriesQuery');
            cy.intercept('GET', getCustomerAfterCheckoutCall).as(
                'gqlCustomerAfterCheckoutQuery'
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
            cy.intercept('GET', getRegionsCall).as('gqlGetRegionsQuery');
            cy.intercept('GET', getSelectedAndAvailableShippingMethodsCall).as(
                'gqlGetSelectedAndAvailableShippingMethodsQuery'
            );
            cy.intercept('GET', getShippingMethodsCall).as(
                'gqlGetShippingMethodsQuery'
            );
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'CreateAccountAfterCheckout');
                aliasMutation(req, 'placeOrder');
                aliasMutation(req, 'SetShippingAddressForEstimate');
                aliasMutation(req, 'SetShippingMethodForEstimate');
            });

            // Test - Add configurable products to cart from Product Pages
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

            cy.visit(productIsadoraSkirt.url);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });

            selectOptionsFromProductPage();
            setQuantityFromProductPage();
            addToCartFromProductPage();
            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });

            assertCartTriggerCount(3);

            // Test - Products are in Cart Page
            cy.visit(cartPageRoute);
            cy.wait(
                ['@gqlGetProductListingQuery', '@gqlGetShippingMethodsQuery'],
                {
                    timeout: 60000
                }
            );

            assertProductInCartPage(productValeriaTwoLayeredTank.name);
            assertProductInCartPage(productIsadoraSkirt.name);

            // Test - Estimate Shipping
            toggleShippingMethodSection();
            toggleShippingMethodEstimate();

            cy.wait(['@gqlGetCountriesQuery', '@gqlGetRegionsQuery'], {
                timeout: 60000
            });

            estimateShippingMethod(completeShippingAddress);

            cy.wait(
                [
                    '@gqlSetShippingAddressForEstimateMutation',
                    '@gqlSetShippingMethodForEstimateMutation'
                ],
                {
                    timeout: 60000
                }
            );

            selectShippingMethodFromCartPage(
                defaultShippingMethods.flatrate.code
            );

            cy.wait(['@gqlSetShippingMethodForEstimateMutation'], {
                timeout: 60000
            });

            // Test - Set Guest Shipping Address
            cy.visitCheckoutPage();

            setGuestShippingAddress(completeShippingAddress);

            cy.wait(['@gqlGetSelectedAndAvailableShippingMethodsQuery'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(
                completeShippingAddress
            );
            assertSelectedShippingMethodInCheckoutPage(
                defaultShippingMethods.flatrate.label
            );

            // Test - Edit Payment Information
            cy.wait(['@gqlGetPaymentInformationQuery'], {
                timeout: 60000
            });

            editCreditCardInformation({ ...checkoutBillingData[0] });

            // Test - Review Order
            reviewOrder();

            cy.wait(['@gqlGetItemsInCartQuery'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(
                completeShippingAddress
            );
            assertProductInCheckoutPage({
                name: productValeriaTwoLayeredTank.name
            });
            assertProductInCheckoutPage({ name: productIsadoraSkirt.name });

            // Test - Place Order
            placeOrder();

            cy.wait(['@gqlplaceOrderMutation', '@gqlGetCheckoutDetailsQuery'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(
                completeShippingAddress,
                true
            );
            assertSelectedShippingMethodInCheckoutPage(
                defaultShippingMethods.flatrate.label,
                true
            );
            assertProductInCheckoutPage(
                { name: productValeriaTwoLayeredTank.name },
                true
            );
            assertProductInCheckoutPage(
                { name: productIsadoraSkirt.name },
                true
            );

            // Test - Account create from Order Confirmation Page
            createAccountFromOrderConfirmationPage({
                password: accountPassword
            });

            cy.wait(
                [
                    '@gqlCreateAccountAfterCheckoutMutation',
                    '@gqlCustomerAfterCheckoutQuery'
                ],
                {
                    timeout: 60000
                }
            );

            assertCreateAccount(firstName);

            // Test - Access Account Information
            goToMyAccount(firstName, accountInformationPage);
            assertAccountInformationHeading(accountInformationPage);
        });
    }
);
