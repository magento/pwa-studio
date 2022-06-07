const canHandle = event => event.type === 'CART_ADD_ITEM';

const handle = (sdk, event) => {
    const { payload } = event;

    const {
        cartId,
        currencyCode,
        priceTotal,
        quantity,
        name,
        sku,
        selectedOptions
    } = payload;

    const configurableOptions = selectedOptions
        ? [
              {
                  optionLabel: selectedOptions.attribute,
                  valueLabel: selectedOptions.value
              }
          ]
        : null;

    const cartItemContext = {
        id: cartId,
        prices: {
            subtotalExcludingTax: {
                value: priceTotal * quantity,
                currency: currencyCode
            }
        },
        items: [
            {
                product: {
                    name: name,
                    sku: sku,
                    configurableOptions: configurableOptions
                },
                prices: {
                    price: {
                        value: priceTotal,
                        currency: currencyCode
                    }
                }
            }
        ],
        possibleOnepageCheckout: false,
        giftMessageSelected: false,
        giftWrappingSelected: false
    };

    sdk.context.setShoppingCart(cartItemContext);
    sdk.publish.addToCart();
};

export default {
    canHandle,
    handle
};
