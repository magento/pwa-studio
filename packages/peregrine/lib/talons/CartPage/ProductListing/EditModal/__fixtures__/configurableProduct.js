export const configurableItemResponse = {
    data: {
        products: {
            items: [
                {
                    configurable_options: [
                        {
                            attribute_id: '123',
                            attribute_code: 'color'
                        },
                        {
                            attribute_id: '456',
                            attribute_code: 'size'
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
    configurable_options: [{ id: 123, value_id: 1 }, { id: 456, value_id: 1 }],
    id: 123,
    product: {
        sku: 'SP01'
    },
    quantity: 5
};
