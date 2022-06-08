export default {
    type: 'CHECKOUT_PLACE_ORDER_BUTTON_CLICKED',
    payload: {
        cart_id: 'adaIGWl4UsoKOGIeX17FPrnMq3bXHVZA',
        amount: {
            grand_total: {
                value: 466.01,
                currency: 'USD',
                __typename: 'Money'
            },
            discounts: null,
            __typename: 'CartPrices'
        },
        shipping: [
            {
                amount: {
                    value: 0,
                    currency: 'USD',
                    __typename: 'Money'
                },
                carrier_title: 'Free Shipping',
                method_title: 'Free',
                __typename: 'SelectedShippingMethod'
            }
        ],
        payment: {
            purchase_order_number: null,
            title: 'Credit Card',
            __typename: 'SelectedPaymentMethod'
        },
        products: [
            {
                uid: 'Mjk3Nw==',
                product: {
                    uid: 'MTEzNw==',
                    sku: 'VP08',
                    name: 'Bella Eyelet Capris',
                    thumbnail: {
                        url:
                            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/p/vp08-rn_main_2.jpg',
                        __typename: 'ProductImage'
                    },
                    __typename: 'ConfigurableProduct'
                },
                prices: {
                    price: {
                        currency: 'USD',
                        value: 98,
                        __typename: 'Money'
                    },
                    row_total: {
                        value: 294,
                        __typename: 'Money'
                    },
                    total_item_discount: {
                        value: 0,
                        __typename: 'Money'
                    },
                    __typename: 'CartItemPrices'
                },
                quantity: 3,
                configurable_options: [
                    {
                        configurable_product_option_uid:
                            'Y29uZmlndXJhYmxlLzExMzcvMTU3',
                        option_label: 'Fashion Color',
                        configurable_product_option_value_uid:
                            'Y29uZmlndXJhYmxlLzE1Ny8zNQ==',
                        value_label: 'Mint',
                        __typename: 'SelectedConfigurableOption'
                    },
                    {
                        configurable_product_option_uid:
                            'Y29uZmlndXJhYmxlLzExMzcvMTkw',
                        option_label: 'Fashion Size',
                        configurable_product_option_value_uid:
                            'Y29uZmlndXJhYmxlLzE5MC80OQ==',
                        value_label: '6',
                        __typename: 'SelectedConfigurableOption'
                    }
                ],
                __typename: 'ConfigurableCartItem'
            },
            {
                uid: 'Mjk3OQ==',
                product: {
                    uid: 'MTE1OA==',
                    sku: 'VA09',
                    name: 'Thin Leather Braided Belt',
                    thumbnail: {
                        url:
                            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/a/va09-br_main_2.jpg',
                        __typename: 'ProductImage'
                    },
                    __typename: 'ConfigurableProduct'
                },
                prices: {
                    price: {
                        currency: 'USD',
                        value: 38,
                        __typename: 'Money'
                    },
                    row_total: {
                        value: 38,
                        __typename: 'Money'
                    },
                    total_item_discount: {
                        value: 0,
                        __typename: 'Money'
                    },
                    __typename: 'CartItemPrices'
                },
                quantity: 1,
                configurable_options: [
                    {
                        configurable_product_option_uid:
                            'Y29uZmlndXJhYmxlLzExNTgvMTkw',
                        option_label: 'Fashion Size',
                        configurable_product_option_value_uid:
                            'Y29uZmlndXJhYmxlLzE5MC80NA==',
                        value_label: 'M',
                        __typename: 'SelectedConfigurableOption'
                    }
                ],
                __typename: 'ConfigurableCartItem'
            },
            {
                uid: 'Mjk4Nw==',
                product: {
                    uid: 'MTI=',
                    sku: 'VA22-SI-NA',
                    name: 'Silver Amor Bangle Set',
                    thumbnail: {
                        url:
                            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/a/va22-si_main.jpg',
                        __typename: 'ProductImage'
                    },
                    __typename: 'SimpleProduct'
                },
                prices: {
                    price: {
                        currency: 'USD',
                        value: 98,
                        __typename: 'Money'
                    },
                    row_total: {
                        value: 98,
                        __typename: 'Money'
                    },
                    total_item_discount: {
                        value: 0,
                        __typename: 'Money'
                    },
                    __typename: 'CartItemPrices'
                },
                quantity: 1,
                __typename: 'SimpleCartItem'
            }
        ]
    }
};
