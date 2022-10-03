import { createProductVariants } from '../createProductVariants';

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
        }
    ]
};

test('it creates product variants with out of stock items data added', () => {
    const result = createProductVariants(
        configurableProductWithTwoOptionGroupProps
    );

    expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "attributes": Array [
              Object {
                "code": "fashion_color",
                "value_index": 14,
              },
              Object {
                "code": "fashion_size",
                "value_index": 43,
              },
            ],
            "key": 0,
            "product": Object {
              "stock_status": "IN_STOCK",
            },
          },
          Object {
            "attributes": Array [
              Object {
                "code": "fashion_color",
                "value_index": 14,
              },
              Object {
                "code": "fashion_size",
                "value_index": 44,
              },
            ],
            "key": 1,
            "product": Object {
              "stock_status": "OUT_OF_STOCK",
            },
          },
          Object {
            "attributes": Array [
              Object {
                "code": "fashion_color",
                "value_index": 31,
              },
              Object {
                "code": "fashion_size",
                "value_index": 43,
              },
            ],
            "key": 2,
            "product": Object {
              "stock_status": "OUT_OF_STOCK",
            },
          },
          Object {
            "attributes": Array [
              Object {
                "code": "fashion_color",
                "value_index": 31,
              },
              Object {
                "code": "fashion_size",
                "value_index": 44,
              },
            ],
            "key": 3,
            "product": Object {
              "stock_status": "OUT_OF_STOCK",
            },
          },
        ]
    `);
});
