import { getCartTotal, getCurrency, getFormattedProducts } from '../utils';

const canHandle = event => event.type === 'MINI_CART_VIEW';

const handle = (sdk, event) => {
    const { payload } = event;

    const { cartId: id, products } = payload;

    const cartContext = {
        id: id,
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
};

export default {
    canHandle,
    handle
};
