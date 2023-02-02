export const configurableItemResponse = {
    data: {
        products: {
            items: [
                {
                    configurable_options: [
                        {
                            attribute_id: '123',
                            attribute_code: 'color',
                            label: 'Color',
                            values: [
                                {
                                    label: 'Lilac',
                                    value_index: 1
                                },
                                {
                                    label: 'Red',
                                    value_index: 2
                                }
                            ]
                        },
                        {
                            attribute_id: '456',
                            attribute_code: 'size',
                            label: 'Red',
                            values: [
                                {
                                    label: 'XS',
                                    value_index: 1
                                },
                                {
                                    label: 'S',
                                    value_index: 2
                                }
                            ]
                        }
                    ],
                    variants: [
                        {
                            attributes: [
                                { code: 'color', value_index: 1 },
                                { code: 'size', value_index: 1 }
                            ],
                            product: {
                                price: {
                                    regularPrice: {
                                        amount: {}
                                    }
                                },
                                sku: 'SP11'
                            }
                        },
                        {
                            attributes: [
                                { code: 'color', value_index: 1 },
                                { code: 'size', value_index: 2 }
                            ],
                            product: {
                                price: {
                                    regularPrice: {
                                        amount: {}
                                    }
                                },
                                sku: 'SP12'
                            }
                        },
                        {
                            attributes: [
                                { code: 'color', value_index: 2 },
                                { code: 'size', value_index: 1 }
                            ],
                            product: {
                                price: {
                                    regularPrice: {
                                        amount: {}
                                    }
                                },
                                sku: 'SP21'
                            }
                        },
                        {
                            attributes: [
                                { code: 'color', value_index: 2 },
                                { code: 'size', value_index: 2 }
                            ],
                            product: {
                                price: {
                                    regularPrice: {
                                        amount: {}
                                    }
                                },
                                sku: 'SP22'
                            }
                        }
                    ]
                }
            ]
        }
    },
    error: false,
    loading: false
};

export const cartItem = {
    configurable_options: [
        { id: 123, value_id: 1, option_label: 'Color', value_label: 'Pink' },
        { id: 456, value_id: 1, option_label: 'Size', value_label: 'XS' }
    ],
    id: 123,
    uid: 'NDA=',
    product: {
        sku: 'SP01',
        name: 'Product Name'
    },
    prices: {
        price: {
            value: 9.99,
            currency: 'USD'
        },
        total_item_discount: {
            value: 5
        }
    },
    quantity: 5
};
