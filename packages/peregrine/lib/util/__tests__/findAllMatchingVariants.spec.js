import { findAllMatchingVariants } from '../findAllMatchingVariants';

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
                    value_index: 43
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '70',
                    default_label: 'M',
                    label: 'M',
                    store_label: 'M',
                    use_default_value: true,
                    value_index: 44
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
                    value_index: 43,
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
                    value_index: 44,
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
                    value_index: 31,
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
                stock_status: 'IN_STOCK',
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
        }
    ]
};

const optionCodes = new Map();
for (const option of configurableProductWithTwoOptionGroupProps.configurable_options) {
    optionCodes.set(option.attribute_id, option.attribute_code);
}

test('it returns all matching products of current selection for configurable products with more than one option group', () => {
    const singleOptionSelection = new Map();
    singleOptionSelection.set('179', 14);

    const result = findAllMatchingVariants({
        variants: configurableProductWithTwoOptionGroupProps.variants,
        optionCodes,
        singleOptionSelection
    });

    expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "__typename": "ConfigurableVariant",
            "attributes": Array [
              Object {
                "__typename": "ConfigurableAttributeOption",
                "code": "fashion_color",
                "value_index": 14,
              },
              Object {
                "__typename": "ConfigurableAttributeOption",
                "code": "fashion_size",
                "value_index": 43,
              },
            ],
            "product": Object {
              "__typename": "SimpleProduct",
              "id": 3,
              "sku": "configurableProductPropsConfig1",
              "stock_status": "IN_STOCK",
            },
          },
          Object {
            "__typename": "ConfigurableVariant",
            "attributes": Array [
              Object {
                "__typename": "ConfigurableAttributeOption",
                "code": "fashion_color",
                "value_index": 14,
              },
              Object {
                "__typename": "ConfigurableAttributeOption",
                "code": "fashion_size",
                "value_index": 44,
              },
            ],
            "product": Object {
              "__typename": "SimpleProduct",
              "id": 4,
              "sku": "configurableProductPropsConfig2",
              "stock_status": "OUT_OF_STOCK",
            },
          },
        ]
    `);
});
