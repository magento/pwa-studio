const canHandle = event => event.type === 'CART_ADD_ITEM';

const handle = (sdk, event) => {
    const { payload } = event;

    const {
        cartId,
        currencyCode,
        pricing,
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
                    configurableOptions: configurableOptions,
                    pricing: {
                        regularPrice:
                            pricing?.regularPrice?.amount.value || priceTotal,
                        currencyCode:
                            pricing?.regularPrice?.amount.currency ||
                            currencyCode
                    }
                },
                prices: {
                    price: {
                        value: priceTotal,
                        currency: currencyCode
                    }
                },
                quantity: quantity
            }
        ],
        possibleOnepageCheckout: false,
        giftMessageSelected: false,
        giftWrappingSelected: false
    };

    sdk.context.setProduct(cartItemContext.items[0]);
    sdk.context.setShoppingCart(cartItemContext);
    sdk.context.setChangedProducts({ items: cartItemContext.items });
    sdk.publish.addToCart();
};

export default {
    canHandle,
    handle
};
