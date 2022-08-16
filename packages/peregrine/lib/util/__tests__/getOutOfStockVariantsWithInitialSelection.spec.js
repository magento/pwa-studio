import { getOutOfStockVariantsWithInitialSelection } from '../getOutOfStockVariantsWithInitialSelection';

const configurableProductWithOneOptionGroupProps = {
    __typename: 'ConfigurableProduct',
    stock_status: 'IN_STOCK',
    configurable_options: [
        {
            attribute_code: 'color',
            attribute_id: '93',
            id: 1,
            label: 'Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '20',
                    default_label: 'red',
                    label: 'red',
                    store_label: 'red',
                    use_default_value: true,
                    value_index: 92
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '30',
                    default_label: 'green',
                    label: 'green',
                    store_label: 'green',
                    use_default_value: true,
                    value_index: 93
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '40',
                    default_label: 'blue',
                    label: 'blue',
                    store_label: 'blue',
                    use_default_value: true,
                    value_index: 94
                }
            ]
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig1',
                stock_status: 'OUT_OF_STOCK',
                id: 2
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 93,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig2',
                stock_status: 'IN_STOCK',
                id: 3
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 94,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig2',
                stock_status: 'IN_STOCK',
                id: 4
            },
            __typename: 'ConfigurableVariant'
        }
    ]
};

const configurableProductWithTwoOptionGroupProps = {
    __typename: 'ConfigurableProduct',
    stock_status: 'IN_STOCK',
    configurable_options: [
        {
            attribute_code: 'fashion_color',
            attribute_id: '179',
            id: 1,
            label: 'Fashion Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '20',
                    default_label: 'Gold',
                    label: 'Gold',
                    store_label: 'Gold',
                    use_default_value: true,
                    value_index: 14
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '30',
                    default_label: 'Peach',
                    label: 'Peach',
                    store_label: 'Peach',
                    use_default_value: true,
                    value_index: 31
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '40',
                    default_label: 'Mint',
                    label: 'Mint',
                    store_label: 'Mint',
                    use_default_value: true,
                    value_index: 35
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '50',
                    default_label: 'Lily',
                    label: 'Lily',
                    store_label: 'Lily',
                    use_default_value: true,
                    value_index: 36
                }
            ]
        },
        {
            attribute_code: 'fashion_size',
            attribute_id: '190',
            id: 2,
            label: 'Fashion Size',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '60',
                    default_label: 'L',
                    label: 'L',
                    store_label: 'L',
                    use_default_value: true,
                    value_index: 43,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '70',
                    default_label: 'M',
                    label: 'M',
                    store_label: 'M',
                    use_default_value: true,
                    value_index: 44,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '80',
                    default_label: 'S',
                    label: 'S',
                    store_label: 'S',
                    use_default_value: true,
                    value_index: 45,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '90',
                    default_label: 'XS',
                    label: 'XS',
                    store_label: 'XS',
                    use_default_value: true,
                    value_index: 46,
                    swatch_data: null
                }
            ]
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 45,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig1',
                stock_status: 'IN_STOCK',
                id: 3
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 46,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig2',
                stock_status: 'OUT_OF_STOCK',
                id: 4
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 44,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig3',
                stock_status: 'OUT_OF_STOCK',
                id: 5
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 31,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 43,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig4',
                stock_status: 'OUT_OF_STOCK',
                id: 6
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 35,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 44,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig5',
                stock_status: 'OUT_OF_STOCK',
                id: 7
            },
            __typename: 'ConfigurableVariant'
        }
    ]
};

const configurableProductWithThreeOptionGroupProps = {
    __typename: 'ConfigurableProduct',
    stock_status: 'IN_STOCK',
    configurable_options: [
        {
            attribute_code: 'color',
            attribute_id: '93',
            id: 1,
            label: 'Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '20',
                    default_label: 'Red',
                    label: 'Red',
                    store_label: 'Red',
                    use_default_value: true,
                    value_index: 92
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '30',
                    default_label: 'Green',
                    label: 'Green',
                    store_label: 'Green',
                    use_default_value: true,
                    value_index: 93
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '40',
                    default_label: 'blue',
                    label: 'blue',
                    store_label: 'blue',
                    use_default_value: true,
                    value_index: 94
                }
            ]
        },
        {
            attribute_code: 'fashion_color',
            attribute_id: '179',
            id: 2,
            label: 'Fashion Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '50',
                    default_label: 'Gold',
                    label: 'Gold',
                    store_label: 'Gold',
                    use_default_value: true,
                    value_index: 14
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '60',
                    default_label: 'Peach',
                    label: 'Peach',
                    store_label: 'Peach',
                    use_default_value: true,
                    value_index: 31
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '70',
                    default_label: 'Khaki',
                    label: 'Khaki',
                    store_label: 'Khaki',
                    use_default_value: true,
                    value_index: 32
                }
            ]
        },
        {
            attribute_code: 'fashion_size',
            attribute_id: '190',
            id: 3,
            label: 'Fashion Size',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '80',
                    default_label: 'XL',
                    label: 'XL',
                    store_label: 'XL',
                    use_default_value: true,
                    value_index: 42,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '90',
                    default_label: 'L',
                    label: 'L',
                    store_label: 'L',
                    use_default_value: true,
                    value_index: 43,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '100',
                    default_label: 'M',
                    label: 'M',
                    store_label: 'M',
                    use_default_value: true,
                    value_index: 44,
                    swatch_data: null
                }
            ]
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 43,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig1',
                stock_status: 'IN_STOCK',
                id: 4
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 42,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig2',
                stock_status: 'OUT_OF_STOCK',
                id: 5
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 44,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig3',
                stock_status: 'OUT_OF_STOCK',
                id: 6
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 31,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 43,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig4',
                stock_status: 'OUT_OF_STOCK',
                id: 7
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 93,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 32,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 44,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig5',
                stock_status: 'OUT_OF_STOCK',
                id: 8
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 94,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 32,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 44,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig5',
                stock_status: 'OUT_OF_STOCK',
                id: 9
            },
            __typename: 'ConfigurableVariant'
        }
    ]
};

const configurableProductWithFourOptionGroupProps = {
    __typename: 'ConfigurableProduct',
    stock_status: 'IN_STOCK',
    configurable_options: [
        {
            attribute_code: 'color',
            attribute_id: '93',
            id: 1,
            label: 'Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '20',
                    default_label: 'Red',
                    label: 'Red',
                    store_label: 'Red',
                    use_default_value: true,
                    value_index: 92
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '30',
                    default_label: 'Green',
                    label: 'Green',
                    store_label: 'Green',
                    use_default_value: true,
                    value_index: 93
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '40',
                    default_label: 'yellow',
                    label: 'yellow',
                    store_label: 'yellow',
                    use_default_value: true,
                    value_index: 95
                }
            ]
        },
        {
            attribute_code: 'fashion_color',
            attribute_id: '179',
            id: 2,
            label: 'Fashion Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '50',
                    default_label: 'Gold',
                    label: 'Gold',
                    store_label: 'Gold',
                    use_default_value: true,
                    value_index: 14
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '60',
                    default_label: 'Mint',
                    label: 'Mint',
                    store_label: 'Mint',
                    use_default_value: true,
                    value_index: 35
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '70',
                    default_label: 'Cocoa',
                    label: 'Cocoa',
                    store_label: 'Cocoa',
                    use_default_value: true,
                    value_index: 38
                }
            ]
        },
        {
            attribute_code: 'accessory_brand',
            attribute_id: '185',
            id: 3,
            label: 'Brand',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '80',
                    default_label: 'Venia',
                    label: 'Venia',
                    store_label: 'Venia',
                    use_default_value: true,
                    value_index: 22,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '90',
                    default_label: 'Luma',
                    label: 'Luma',
                    store_label: 'Luma',
                    use_default_value: true,
                    value_index: 23,
                    swatch_data: null
                }
            ]
        },
        {
            attribute_code: 'fashion_size',
            attribute_id: '190',
            id: 3,
            label: 'Fashion Size',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '100',
                    default_label: 'L',
                    label: 'L',
                    store_label: 'L',
                    use_default_value: true,
                    value_index: 43,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '110',
                    default_label: 'M',
                    label: 'M',
                    store_label: 'M',
                    use_default_value: true,
                    value_index: 44,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '120',
                    default_label: 'S',
                    label: 'S',
                    store_label: 'S',
                    use_default_value: true,
                    value_index: 45,
                    swatch_data: null
                }
            ]
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 22,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 43,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig1',
                stock_status: 'IN_STOCK',
                id: 4
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 22,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 44,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig2',
                stock_status: 'OUT_OF_STOCK',
                id: 5
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 35,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 22,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 45,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig3',
                stock_status: 'OUT_OF_STOCK',
                id: 6
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 93,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 38,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 22,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 44,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig4',
                stock_status: 'OUT_OF_STOCK',
                id: 7
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 23,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 44,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig5',
                stock_status: 'OUT_OF_STOCK',
                id: 8
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 14,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 23,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 45,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig5',
                stock_status: 'OUT_OF_STOCK',
                id: 9
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 95,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 35,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 23,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 45,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig5',
                stock_status: 'OUT_OF_STOCK',
                id: 9
            },
            __typename: 'ConfigurableVariant'
        }
    ]
};

const configurableProductWithFiveOptionGroupProps = {
    __typename: 'ConfigurableProduct',
    stock_status: 'IN_STOCK',
    configurable_options: [
        {
            attribute_code: 'color',
            attribute_id: '93',
            id: 1,
            label: 'Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '20',
                    default_label: 'Red',
                    label: 'Red',
                    store_label: 'Red',
                    use_default_value: true,
                    value_index: 92
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '30',
                    default_label: 'Green',
                    label: 'Green',
                    store_label: 'Green',
                    use_default_value: true,
                    value_index: 93
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '40',
                    default_label: 'yellow',
                    label: 'yellow',
                    store_label: 'yellow',
                    use_default_value: true,
                    value_index: 95
                }
            ]
        },
        {
            attribute_code: 'fashion_color',
            attribute_id: '179',
            id: 2,
            label: 'Fashion Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '50',
                    default_label: 'Rain',
                    label: 'Rain',
                    store_label: 'Rain',
                    use_default_value: true,
                    value_index: 34
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '60',
                    default_label: 'Lily',
                    label: 'Lily',
                    store_label: 'Lily',
                    use_default_value: true,
                    value_index: 36
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '70',
                    default_label: 'Latte',
                    label: 'Latte',
                    store_label: 'Latte',
                    use_default_value: true,
                    value_index: 37
                }
            ]
        },
        {
            attribute_code: 'accessory_brand',
            attribute_id: '185',
            id: 3,
            label: 'Brand',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '80',
                    default_label: 'Venia',
                    label: 'Venia',
                    store_label: 'Venia',
                    use_default_value: true,
                    value_index: 22,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '90',
                    default_label: 'Luma',
                    label: 'Luma',
                    store_label: 'Luma',
                    use_default_value: true,
                    value_index: 23,
                    swatch_data: null
                }
            ]
        },
        {
            attribute_code: 'format',
            attribute_id: '189',
            id: 3,
            label: 'Format',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '100',
                    default_label: 'Download',
                    label: 'Download',
                    store_label: 'Download',
                    use_default_value: true,
                    value_index: 28,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '110',
                    default_label: 'DVD',
                    label: 'DVD',
                    store_label: 'DVD',
                    use_default_value: true,
                    value_index: 29,
                    swatch_data: null
                }
            ]
        },
        {
            attribute_code: 'fashion_size',
            attribute_id: '190',
            id: 3,
            label: 'Fashion Size',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '120',
                    default_label: '2',
                    label: '2',
                    store_label: '2',
                    use_default_value: true,
                    value_index: 47,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '130',
                    default_label: '4',
                    label: '4',
                    store_label: '4',
                    use_default_value: true,
                    value_index: 48,
                    swatch_data: null
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '140',
                    default_label: '6',
                    label: '6',
                    store_label: '6',
                    use_default_value: true,
                    value_index: 49,
                    swatch_data: null
                }
            ]
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 36,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 22,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'format',
                    value_index: 29,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 47,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig1',
                stock_status: 'IN_STOCK',
                id: 4
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 36,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 22,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'format',
                    value_index: 28,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 47,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig2',
                stock_status: 'OUT_OF_STOCK',
                id: 5
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 34,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 22,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'format',
                    value_index: 28,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 47,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig3',
                stock_status: 'OUT_OF_STOCK',
                id: 6
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 92,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 34,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 22,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'format',
                    value_index: 28,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 49,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig4',
                stock_status: 'OUT_OF_STOCK',
                id: 7
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 95,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 37,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 23,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'format',
                    value_index: 29,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 49,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig5',
                stock_status: 'OUT_OF_STOCK',
                id: 8
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 93,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_color',
                    value_index: 37,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'accessory_brand',
                    value_index: 23,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'format',
                    value_index: 29,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 49,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig5',
                stock_status: 'OUT_OF_STOCK',
                id: 9
            },
            __typename: 'ConfigurableVariant'
        }
    ]
};

const configurableProductOutOfStockProductNotDisplayed = {
    __typename: 'ConfigurableProduct',
    stock_status: 'IN_STOCK',
    configurable_options: [
        {
            attribute_code: 'color',
            attribute_id: '93',
            id: 1,
            label: 'Color',
            values: [
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '20',
                    default_label: 'red',
                    label: 'red',
                    store_label: 'red',
                    use_default_value: true,
                    value_index: 92
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '30',
                    default_label: 'green',
                    label: 'green',
                    store_label: 'green',
                    use_default_value: true,
                    value_index: 93
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '40',
                    default_label: 'blue',
                    label: 'blue',
                    store_label: 'blue',
                    use_default_value: true,
                    value_index: 94
                }
            ]
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 93,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig2',
                stock_status: 'IN_STOCK',
                id: 3
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'color',
                    value_index: 94,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                __typename: 'SimpleProduct',
                sku: 'configurableProductPropsConfig2',
                stock_status: 'IN_STOCK',
                id: 4
            },
            __typename: 'ConfigurableVariant'
        }
    ]
};

let isOutOfStockProductDisplayed = true;

describe('with configurable Product With One Option Group', () => {
    const configurableOptionCodes = new Map();
    for (const option of configurableProductWithOneOptionGroupProps.configurable_options) {
        configurableOptionCodes.set(option.attribute_id, option.attribute_code);
    }
    test('it returns the out of stock value of initial selections', () => {
        // Initial selections
        const multipleOptionSelections = new Map();
        multipleOptionSelections.set('93', 93);

        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithOneOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelections,
            configurableProductWithOneOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                92,
              ],
            ]
        `);
    });
});

const multipleOptionSelectionsWithTwoOptionGroup = new Map();
multipleOptionSelectionsWithTwoOptionGroup.set('179', 14);
multipleOptionSelectionsWithTwoOptionGroup.set('190', 43);

describe('with configurable Product With Two Option Group', () => {
    const configurableOptionCodes = new Map();
    for (const option of configurableProductWithTwoOptionGroupProps.configurable_options) {
        configurableOptionCodes.set(option.attribute_id, option.attribute_code);
    }
    test('it returns the out of stock value of initial selections', () => {
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithTwoOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithTwoOptionGroup,
            configurableProductWithTwoOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                46,
                44,
              ],
              Array [
                31,
              ],
            ]
        `);
    });
    test('it returns the out of stock value with one selection change', () => {
        multipleOptionSelectionsWithTwoOptionGroup.set('179', 35);

        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithTwoOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithTwoOptionGroup,
            configurableProductWithTwoOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                44,
              ],
              Array [
                31,
              ],
            ]
        `);
    });
    test('it returns the out of stock value with two selection change', () => {
        multipleOptionSelectionsWithTwoOptionGroup.set('179', 35);
        multipleOptionSelectionsWithTwoOptionGroup.set('190', 45);

        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithTwoOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithTwoOptionGroup,
            configurableProductWithTwoOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                44,
              ],
              Array [],
            ]
        `);
    });
});

const multipleOptionSelectionsWithThreeOptionGroup = new Map();
multipleOptionSelectionsWithThreeOptionGroup.set('93', 92);
multipleOptionSelectionsWithThreeOptionGroup.set('179', 14);
multipleOptionSelectionsWithThreeOptionGroup.set('190', 43);

describe('with configurable Product With Three Option Group', () => {
    const configurableOptionCodes = new Map();
    for (const option of configurableProductWithThreeOptionGroupProps.configurable_options) {
        configurableOptionCodes.set(option.attribute_id, option.attribute_code);
    }
    test('it returns the out of stock value of initial selections', () => {
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithThreeOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithThreeOptionGroup,
            configurableProductWithThreeOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                42,
                44,
              ],
              Array [
                31,
              ],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with one selection change', () => {
        multipleOptionSelectionsWithThreeOptionGroup.set('93', 93);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithThreeOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithThreeOptionGroup,
            configurableProductWithThreeOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with two selection change', () => {
        multipleOptionSelectionsWithThreeOptionGroup.set('93', 93);
        multipleOptionSelectionsWithThreeOptionGroup.set('179', 32);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithThreeOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithThreeOptionGroup,
            configurableProductWithThreeOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                44,
              ],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with three selection change', () => {
        multipleOptionSelectionsWithThreeOptionGroup.set('93', 93);
        multipleOptionSelectionsWithThreeOptionGroup.set('179', 32);
        multipleOptionSelectionsWithThreeOptionGroup.set('190', 42);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithThreeOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithThreeOptionGroup,
            configurableProductWithThreeOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                44,
              ],
              Array [],
              Array [],
            ]
        `);
    });
});

const multipleOptionSelectionsWithFourOptionGroup = new Map();
multipleOptionSelectionsWithFourOptionGroup.set('93', 92);
multipleOptionSelectionsWithFourOptionGroup.set('179', 14);
multipleOptionSelectionsWithFourOptionGroup.set('185', 23);
multipleOptionSelectionsWithFourOptionGroup.set('190', 43);

describe('with configurable Product With Four Option Group', () => {
    const configurableOptionCodes = new Map();
    for (const option of configurableProductWithFourOptionGroupProps.configurable_options) {
        configurableOptionCodes.set(option.attribute_id, option.attribute_code);
    }
    test('it returns the out of stock value of initial selections', () => {
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFourOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFourOptionGroup,
            configurableProductWithFourOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                44,
                45,
              ],
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with one selection change', () => {
        multipleOptionSelectionsWithFourOptionGroup.set('185', 22);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFourOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFourOptionGroup,
            configurableProductWithFourOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                44,
              ],
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with two selection change', () => {
        multipleOptionSelectionsWithFourOptionGroup.set('185', 22);
        multipleOptionSelectionsWithFourOptionGroup.set('179', 35);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFourOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFourOptionGroup,
            configurableProductWithFourOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                45,
              ],
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with three selection change', () => {
        multipleOptionSelectionsWithFourOptionGroup.set('185', 22);
        multipleOptionSelectionsWithFourOptionGroup.set('179', 35);
        multipleOptionSelectionsWithFourOptionGroup.set('93', 93);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFourOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFourOptionGroup,
            configurableProductWithFourOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [],
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with four selection change', () => {
        multipleOptionSelectionsWithFourOptionGroup.set('185', 22);
        multipleOptionSelectionsWithFourOptionGroup.set('179', 35);
        multipleOptionSelectionsWithFourOptionGroup.set('93', 93);
        multipleOptionSelectionsWithFourOptionGroup.set('190', 45);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFourOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFourOptionGroup,
            configurableProductWithFourOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [],
              Array [],
              Array [],
              Array [
                92,
              ],
            ]
        `);
    });
});

const multipleOptionSelectionsWithFiveOptionGroup = new Map();
multipleOptionSelectionsWithFiveOptionGroup.set('190', 49);
multipleOptionSelectionsWithFiveOptionGroup.set('189', 29);
multipleOptionSelectionsWithFiveOptionGroup.set('185', 23);
multipleOptionSelectionsWithFiveOptionGroup.set('179', 37);
multipleOptionSelectionsWithFiveOptionGroup.set('93', 92);

describe('with configurable Product With Five Option Group', () => {
    const configurableOptionCodes = new Map();
    for (const option of configurableProductWithFiveOptionGroupProps.configurable_options) {
        configurableOptionCodes.set(option.attribute_id, option.attribute_code);
    }
    test('it returns the out of stock value of initial selections', () => {
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFiveOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFiveOptionGroup,
            configurableProductWithFiveOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                95,
                93,
              ],
              Array [],
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with one selection change', () => {
        multipleOptionSelectionsWithFiveOptionGroup.set('179', 34);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFiveOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFiveOptionGroup,
            configurableProductWithFiveOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [],
              Array [],
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with two selection change', () => {
        multipleOptionSelectionsWithFiveOptionGroup.set('179', 34);
        multipleOptionSelectionsWithFiveOptionGroup.set('185', 22);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFiveOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFiveOptionGroup,
            configurableProductWithFiveOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [],
              Array [],
              Array [],
              Array [
                28,
              ],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with three selection change', () => {
        multipleOptionSelectionsWithFiveOptionGroup.set('179', 34);
        multipleOptionSelectionsWithFiveOptionGroup.set('185', 22);
        multipleOptionSelectionsWithFiveOptionGroup.set('190', 48);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFiveOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFiveOptionGroup,
            configurableProductWithFiveOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [],
              Array [],
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
    test('it returns the out of stock value with four selection change', () => {
        multipleOptionSelectionsWithFiveOptionGroup.set('179', 34);
        multipleOptionSelectionsWithFiveOptionGroup.set('185', 22);
        multipleOptionSelectionsWithFiveOptionGroup.set('190', 48);
        multipleOptionSelectionsWithFiveOptionGroup.set('189', 28);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFiveOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFiveOptionGroup,
            configurableProductWithFiveOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [],
              Array [],
              Array [],
              Array [],
              Array [
                47,
                49,
              ],
            ]
        `);
    });
    test('it returns the out of stock value with five selection change', () => {
        multipleOptionSelectionsWithFiveOptionGroup.set('179', 34);
        multipleOptionSelectionsWithFiveOptionGroup.set('185', 22);
        multipleOptionSelectionsWithFiveOptionGroup.set('190', 48);
        multipleOptionSelectionsWithFiveOptionGroup.set('189', 28);
        multipleOptionSelectionsWithFiveOptionGroup.set('93', 93);
        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductWithFiveOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelectionsWithFiveOptionGroup,
            configurableProductWithFiveOptionGroupProps,
            isOutOfStockProductDisplayed
        );
        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [],
              Array [],
              Array [],
              Array [],
              Array [],
            ]
        `);
    });
});

describe('when out of stock configurable products not displayed', () => {
    const configurableOptionCodes = new Map();
    for (const option of configurableProductOutOfStockProductNotDisplayed.configurable_options) {
        configurableOptionCodes.set(option.attribute_id, option.attribute_code);
    }
    test('it returns the out of stock value of initial selections', () => {
        isOutOfStockProductDisplayed = false;
        // Initial selections
        const multipleOptionSelections = new Map();
        multipleOptionSelections.set('93', 93);

        const result = getOutOfStockVariantsWithInitialSelection(
            configurableProductOutOfStockProductNotDisplayed,
            configurableOptionCodes,
            multipleOptionSelections,
            configurableProductOutOfStockProductNotDisplayed,
            isOutOfStockProductDisplayed
        );

        expect(result).toMatchInlineSnapshot(`
            Array [
              Array [
                92,
              ],
            ]
        `);
    });
});
