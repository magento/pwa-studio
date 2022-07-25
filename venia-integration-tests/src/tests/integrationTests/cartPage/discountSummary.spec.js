import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';
import { header as headerAssertions } from '../../../assertions';
import {
    productPage as productPageActions,
    miniCart as miniCartActions,
    cartPage as cartPageActions
} from '../../../actions';
import { aliasMutation } from '../../../utils/graphql-test-utils';
import {
    assertDiscountSummaryInCartPage,
    assertDiscountSummaryIndividualDiscountNotVisibleInCartPage,
    assertDiscountSummaryIndividualDiscountVisibleInCartPage,
    assertIndividualDiscount
} from '../../../assertions/cartPage';
const { toggleDiscountSection } = cartPageActions;
const {
    setProductColorOption,
    setProductSizeOption,
    setQuantityFromProductPage,
    addToCartFromProductPage
} = productPageActions;
const { triggerMiniCart, goToCartPageFromEditCartButton } = miniCartActions;
const { assertCartTriggerCount } = headerAssertions;

const { productValeriaTwoLayeredTank } = productPageFixtures;
const {
    getPriceSummaryCall,
    hitGraphqlPath,
    getProductDetailForProductPageCall,
    getProductListingCall
} = graphqlMockedCallsFixtures;

describe(
    'Verify discount summary based on cart price rule ',
    { tags: ['@integration', '@commerce', '@open-source', '@ci', '@cart'] },
    () => {
        it('Discount summary dropdown renders correctly', () => {
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
            });
            cy.intercept('GET', getProductListingCall).as(
                'gqlGetProductListingQuery'
            );
            cy.intercept('GET', getPriceSummaryCall, {
                fixture: 'cartPage/priceSummary/priceSummary.json'
            }).as('gqlGetPriceSummaryQuery');
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

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
            cy.wait(['@gqlGetPriceSummaryQuery'], { timeout: 60000 });
            // TODO: Check button toggle. Individual discount not shown. Click toggle. See individual discount. Click toggle.
            // No longer see individual discount
            // Check discount summary without individual discount
            assertDiscountSummaryInCartPage();
            assertDiscountSummaryIndividualDiscountNotVisibleInCartPage();
            // Check discount summary with individual discount
            toggleDiscountSection();
            assertDiscountSummaryInCartPage();
            assertDiscountSummaryIndividualDiscountVisibleInCartPage();
            assertIndividualDiscount('discount1', 1);
            assertIndividualDiscount('discount2', 2);
            // Check discount summary without individual discount again
            toggleDiscountSection();
            assertDiscountSummaryInCartPage();
            assertDiscountSummaryIndividualDiscountNotVisibleInCartPage();
        });
    }
);
