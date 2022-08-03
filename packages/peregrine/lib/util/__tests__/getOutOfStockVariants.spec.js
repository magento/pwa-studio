import { getOutOfStockVariants } from '../getOutOfStockVariants';

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
                    value_index: 92,
                    swatch_data: null,
                    media_gallery_entries: []
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '30',
                    default_label: 'green',
                    label: 'green',
                    store_label: 'green',
                    use_default_value: true,
                    value_index: 93,
                    swatch_data: null,
                    media_gallery_entries: []
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '40',
                    default_label: 'blue',
                    label: 'blue',
                    store_label: 'blue',
                    use_default_value: true,
                    value_index: 94,
                    swatch_data: null,
                    media_gallery_entries: []
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
                id: 2,
                media_gallery_entries: [],
                price: {
                    regularPrice: {
                        amount: {
                            value: 88
                        }
                    }
                },
                custom_attributes: []
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
                id: 3,
                media_gallery_entries: [],
                price: {
                    regularPrice: {
                        amount: {
                            value: 88
                        }
                    }
                },
                custom_attributes: []
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
                id: 4,
                media_gallery_entries: [],
                price: {
                    regularPrice: {
                        amount: {
                            value: 88
                        }
                    }
                },
                custom_attributes: []
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
                    value_index: 14,
                    swatch_data: null,
                    media_gallery_entries: []
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '30',
                    default_label: 'Peach',
                    label: 'Peach',
                    store_label: 'Peach',
                    use_default_value: true,
                    value_index: 31,
                    swatch_data: null,
                    media_gallery_entries: []
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '40',
                    default_label: 'Mint',
                    label: 'Mint',
                    store_label: 'Mint',
                    use_default_value: true,
                    value_index: 35,
                    swatch_data: null,
                    media_gallery_entries: []
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '50',
                    default_label: 'Lily',
                    label: 'Lily',
                    store_label: 'Lily',
                    use_default_value: true,
                    value_index: 36,
                    swatch_data: null,
                    media_gallery_entries: []
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
                    swatch_data: null,
                    media_gallery_entries: []
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '70',
                    default_label: 'M',
                    label: 'M',
                    store_label: 'M',
                    use_default_value: true,
                    value_index: 44,
                    swatch_data: null,
                    media_gallery_entries: []
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '80',
                    default_label: 'S',
                    label: 'S',
                    store_label: 'S',
                    use_default_value: true,
                    value_index: 45,
                    swatch_data: null,
                    media_gallery_entries: []
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '90',
                    default_label: 'XS',
                    label: 'XS',
                    store_label: 'XS',
                    use_default_value: true,
                    value_index: 46,
                    swatch_data: null,
                    media_gallery_entries: []
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
                id: 3,
                media_gallery_entries: [],
                price: {
                    regularPrice: {
                        amount: {
                            value: 60
                        }
                    }
                },
                custom_attributes: []
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
                id: 4,
                media_gallery_entries: [],
                price: {
                    regularPrice: {
                        amount: {
                            value: 60
                        }
                    }
                },
                custom_attributes: []
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
                id: 5,
                media_gallery_entries: [],
                price: {
                    regularPrice: {
                        amount: {
                            value: 60
                        }
                    }
                },
                custom_attributes: []
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
                id: 6,
                media_gallery_entries: [],
                price: {
                    regularPrice: {
                        amount: {
                            value: 60
                        }
                    }
                },
                custom_attributes: []
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
                id: 7,
                media_gallery_entries: [],
                price: {
                    regularPrice: {
                        amount: {
                            value: 60
                        }
                    }
                },
                custom_attributes: []
            },
            __typename: 'ConfigurableVariant'
        }
    ]
};

const optionCodesOneOptionGroup = new Map();
for (const option of configurableProductWithOneOptionGroupProps.configurable_options) {
    optionCodesOneOptionGroup.set(option.attribute_id, option.attribute_code);
}
const optionCodesTwoOptionGroup = new Map();
for (const option of configurableProductWithTwoOptionGroupProps.configurable_options) {
    optionCodesTwoOptionGroup.set(option.attribute_id, option.attribute_code);
}
const isOutOfStockProductDisplayed = false;

describe('with configurable Product With One Option Group', () => {
    test('it returns the out of stock value without selection needed', () => {
        const singleOptionSelection = undefined;
        const optionSelections = new Map();
        optionSelections.set('93', undefined);

        const result = getOutOfStockVariants({
            product: configurableProductWithOneOptionGroupProps,
            optionCodes: optionCodesOneOptionGroup,
            singleOptionSelection,
            optionSelections,
            isOutOfStockProductDisplayed
        });
        expect(result).toMatchInlineSnapshot(`
        Array [
            Array [
              92,
            ],
          ]
        `);
    });
});

describe('with configurable Product With Two Option Group', () => {
    test('it returns the out of stock value with one selection', () => {
        const singleOptionSelection = new Map();
        singleOptionSelection.set('179', 14);
        const optionSelections = new Map();
        optionSelections.set('179', 14);
        optionSelections.set('190', undefined);

        const result = getOutOfStockVariants({
            product: configurableProductWithTwoOptionGroupProps,
            optionCodes: optionCodesTwoOptionGroup,
            singleOptionSelection,
            optionSelections,
            isOutOfStockProductDisplayed
        });
        expect(result).toMatchInlineSnapshot(`
        Array [
            Array [
              92,
            ],
          ]
        `);
    });
});
