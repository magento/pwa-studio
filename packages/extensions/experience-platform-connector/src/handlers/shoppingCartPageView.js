import { getCartTotal, getCurrency, getFormattedProducts } from '../utils';

const canHandle = event => event.type === 'CART_PAGE_VIEW';

const handle = (sdk, event) => {
    const { payload } = event;

    const { cart_id: id, products } = payload;

    const cartContext = {
        id,
        prices: {
            subtotalExcludingTax: {
                value: getCartTotal(products),
                currency: getCurrency(products)
            }
        },
        items: getFormattedProducts(products),
        possibleOnepageCheckout: false,
        giftMessageSelected: false,
        giftWrappingSelected: false
    };

    sdk.context.setShoppingCart(cartContext);
    sdk.publish.shoppingCartView();

    // Send out page view event
    const pageContext = {
        pageType: 'Cart',
        pageName: 'Cart',
        eventType: 'visibilityHidden',
        maxXOffset: 0,
        maxYOffset: 0,
        minXOffset: 0,
        minYOffset: 0
    };

    sdk.context.setPage(pageContext);
    sdk.publish.pageView();
};

export default {
    canHandle,
    handle
};
