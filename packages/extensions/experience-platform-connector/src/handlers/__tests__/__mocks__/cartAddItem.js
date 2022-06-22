export const addConfigurableProductEvent = {
    type: 'CART_ADD_ITEM',
    payload: {
        cartId: 'kAR5Gg6uPC6J5wGY0ebecyKfX905epmU',
        sku: 'VSK03',
        name: 'Johanna Skirt',
        priceTotal: 78,
        currencyCode: 'USD',
        discountAmount: 0,
        selectedOptions: [
            {
                attribute: 'Fashion Color',
                value: 'Peach'
            },
            {
                attribute: 'Fashion Size',
                value: 'M'
            }
        ],
        quantity: 1
    }
};

export const addSimpleProductEvent = {
    type: 'CART_ADD_ITEM',
    payload: {
        cartId: 'kAR5Gg6uPC6J5wGY0ebecyKfX905epmU',
        sku: 'VA15-SI-NA',
        name: 'Silver Sol Earrings',
        priceTotal: 48,
        currencyCode: 'USD',
        discountAmount: 0,
        selectedOptions: [],
        quantity: 1
    }
};
