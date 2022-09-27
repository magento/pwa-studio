import { getOutOfStockIndexes } from '../getOutOfStockIndexes';

const sampleItems = [
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
            sku: 'configurableProductPropsConfig4',
            stock_status: 'OUT_OF_STOCK',
            id: 6
        },
        __typename: 'ConfigurableVariant'
    }
];

const sampleItemsWithoutOutOfStockProducts = [
    {
        attributes: [
            {
                code: 'fashion_color',
                value_index: 30,
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
                value_index: 30,
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
            stock_status: 'IN_STOCK',
            id: 4
        },
        __typename: 'ConfigurableVariant'
    },
    {
        attributes: [
            {
                code: 'fashion_color',
                value_index: 30,
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
            stock_status: 'IN_STOCK',
            id: 5
        },
        __typename: 'ConfigurableVariant'
    },
    {
        attributes: [
            {
                code: 'fashion_color',
                value_index: 30,
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
            sku: 'configurableProductPropsConfig4',
            stock_status: 'IN_STOCK',
            id: 6
        },
        __typename: 'ConfigurableVariant'
    }
];

test('it returns out of stock item value_index', () => {
    const result = getOutOfStockIndexes(sampleItems);

    expect(result).toMatchInlineSnapshot(`
        Array [
          Array [
            14,
            44,
          ],
          Array [
            14,
            46,
          ],
        ]
    `);
});

test('it returns empty array if no out of stock products', () => {
    const result = getOutOfStockIndexes(sampleItemsWithoutOutOfStockProducts);

    expect(result).toMatchInlineSnapshot(`Array []`);
});
