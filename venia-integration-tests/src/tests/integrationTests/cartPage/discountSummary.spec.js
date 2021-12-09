import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';
import { header as headerAssertions } from '../../../assertions';
import {
    productPage as productPageActions,
    miniCart as miniCartActions
} from '../../../actions';
const {
    setProductColorOption,
    setProductSizeOption,
    setQuantityFromProductPage,
    addToCartFromProductPage
} = productPageActions;
const { triggerMiniCart, goToCartPageFromEditCartButton } = miniCartActions;
const { assertCartTriggerCount } = headerAssertions;

const { productValeriaTwoLayeredTank } = productPageFixtures;
const { getPriceSummaryCall } = graphqlMockedCallsFixtures;

it('Discount summary dropdown renders correctly', () => {
    cy.intercept('GET', getPriceSummaryCall, {
        fixture: 'cartPage/priceSummary/priceSummary.json'
    }).as('gqlGetPriceSummaryQuery');

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
});
