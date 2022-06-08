import { getCartTotal, getCurrency, getFormattedProducts } from '../utils';

const canHandle = event => event.type === 'CHECKOUT_PAGE_VIEW';

const handle = (sdk, event) => {
    const { payload } = event;

    const { cart_id, products } = payload;

    const cartContext = {
        id: cart_id,
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
    sdk.publish.initiateCheckout();
};

export default {
    canHandle,
    handle
};
