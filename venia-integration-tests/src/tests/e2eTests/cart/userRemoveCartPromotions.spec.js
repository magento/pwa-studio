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
    getAppliedCouponsCall,
    getAppliedGiftCardsCall,
    getProductDetailForProductPageCall,
    getProductListingCall,
    hitGraphqlPath
} = graphqlMockedCallsFixtures;
const { productValeriaTwoLayeredTank } = productPageFixtures;

const {
    toggleCouponCodeSection,
    toggleGiftCardSection,
    setCouponCodeFromCartPage,
    setGiftCardFromCartPage,
    removeCouponCodeFromCartPage,
    removeGiftCardsFromCartPage
} = cartPageActions;
const {
    addToCartFromProductPage,
    selectOptionsFromProductPage,
    setQuantityFromProductPage
} = productPageActions;

const {
    assertProductInCartPage,
    assertAppliedCouponCodeInCartPage,
    assertAppliedGiftCardInCartPage,
    assertNoCouponCodeInCartPage,
    assertNoGiftCardInCartPage
} = cartPageAssertions;
const { assertCartTriggerCount } = headerAssertions;

describe(
    'PWA-1407: verify remove promotion cart action',
    { tags: ['@e2e', '@commerce', '@ci', '@cart'] },
    () => {
        it('user should be able to add and remove promotions from cart', () => {
            cy.intercept('GET', getAppliedCouponsCall).as(
                'gqlGetAppliedCouponsQuery'
            );
            cy.intercept('GET', getAppliedGiftCardsCall).as(
                'gqlGetAppliedGiftCardsQuery'
            );
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );
            cy.intercept('GET', getProductListingCall).as(
                'gqlGetProductListingQuery'
            );
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'applyCouponToCart');
                aliasMutation(req, 'applyGiftCardToCart');
                aliasMutation(req, 'removeCouponFromCart');
                aliasMutation(req, 'removeGiftCard');
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

            // Test - Products are in Cart Page
            cy.visit(cartPageRoute);
            cy.wait(
                [
                    '@gqlGetProductListingQuery',
                    '@gqlGetAppliedCouponsQuery',
                    '@gqlGetAppliedGiftCardsQuery'
                ],
                {
                    timeout: 60000
                }
            );

            assertProductInCartPage(productValeriaTwoLayeredTank.name);

            // Test - Add Coupon Code
            toggleCouponCodeSection();
            setCouponCodeFromCartPage(Cypress.env('defaultData_couponCode'));

            cy.wait(['@gqlapplyCouponToCartMutation'], {
                timeout: 60000
            });

            assertAppliedCouponCodeInCartPage();

            // Test - Add Gift Card
            toggleGiftCardSection();
            setGiftCardFromCartPage(Cypress.env('defaultData_giftCardNumber'));

            cy.wait(['@gqlapplyGiftCardToCartMutation'], {
                timeout: 60000
            });

            assertAppliedGiftCardInCartPage();

            // Test - Remove Coupon Code
            removeCouponCodeFromCartPage();

            cy.wait(['@gqlremoveCouponFromCartMutation'], {
                timeout: 60000
            });

            assertNoCouponCodeInCartPage();

            // Test - Remove Gift Card
            removeGiftCardsFromCartPage();

            cy.wait(['@gqlremoveGiftCardMutation'], {
                timeout: 60000
            });

            assertNoGiftCardInCartPage();
        });
    }
);
