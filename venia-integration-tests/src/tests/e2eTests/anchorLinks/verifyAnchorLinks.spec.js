import {
    cartPage as cartPageFixtures,
    homePage as homePageFixtures,
    productPage as productPageFixtures,
    miniCart as miniCartFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import {
    cartPage as cartPageActions,
    miniCart as miniCartActions,
    productPage as productPageActions,
    header as headerActions
} from '../../../actions';
import {
    productPage as productPageAssertions,
    miniCart as miniCartAssertions
} from '../../../assertions';
import { aliasMutation } from '../../../utils/graphql-test-utils';
const {
    triggerMiniCart,
    moveToCheckoutFromMiniCart,
    clickProductLinkFromMiniCart,
    clickProductImageLinkFromMiniCart
} = miniCartActions;

const { clickHeaderLogo } = headerActions;
const { assertProductName } = productPageAssertions;

const { checkoutRoute } = miniCartFixtures;
const { homePage } = homePageFixtures;
const { cartPageRoute } = cartPageFixtures;
const { productValeriaTwoLayeredTank } = productPageFixtures;
const {
    getProductDetailForProductPageCall,
    hitGraphqlPath
} = graphqlMockedCallsFixtures;

const {
    clickProductImageLinkFromCart,
    clickProductLinkFromCart
} = cartPageActions;
const {
    selectOptionsFromProductPage,
    setQuantityFromProductPage,
    addToCartFromProductPage
} = productPageActions;
const { assertGuestCheckoutPage } = miniCartAssertions;

describe(
    'PWA-1424: verify anchor links',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci'] },
    () => {
        it('Verify venia anchor links', () => {
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
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
            triggerMiniCart();
            moveToCheckoutFromMiniCart();

            cy.visitPage(checkoutRoute);
            assertGuestCheckoutPage();
            cy.checkUrlPath('/checkout');

            clickHeaderLogo();
            cy.checkUrlPath(homePage);

            cy.visitPage(homePage);
            triggerMiniCart();
            clickProductLinkFromMiniCart();
            assertProductName(productValeriaTwoLayeredTank.name);
            cy.checkUrlPath(productValeriaTwoLayeredTank.url);

            cy.visitPage(homePage);
            triggerMiniCart();
            clickProductImageLinkFromMiniCart();
            assertProductName(productValeriaTwoLayeredTank.name);
            cy.checkUrlPath(productValeriaTwoLayeredTank.url);

            cy.visitPage(cartPageRoute);
            clickProductImageLinkFromCart();
            assertProductName(productValeriaTwoLayeredTank.name);
            cy.checkUrlPath(productValeriaTwoLayeredTank.url);

            cy.visitPage(cartPageRoute);
            clickProductLinkFromCart();
            assertProductName(productValeriaTwoLayeredTank.name);
            cy.checkUrlPath(productValeriaTwoLayeredTank.url);
        });
    }
);
