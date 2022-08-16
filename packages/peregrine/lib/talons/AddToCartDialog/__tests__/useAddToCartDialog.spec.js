import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';

import defaultOperations from '../addToCartDialog.gql';
import { useAddToCartDialog } from '../useAddToCartDialog';
import { useEventingContext } from '../../../context/eventing';
import createTestInstance from '../../../util/createTestInstance';
import { getOutOfStockVariants } from '@magento/peregrine/lib/util/getOutOfStockVariants';

jest.mock('../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

jest.mock('@magento/peregrine/lib/util/getOutOfStockVariants', () => ({
    getOutOfStockVariants: jest.fn().mockReturnValue([])
}));

const productMock = {
    __typename: 'ConfigurableProduct',
    configurable_options: [],
    configurable_product_options_selection: {
        media_gallery: [
            {
                label: 'red-shirt',
                url: 'https://example.com/media/red-shirt.jpg'
            }
        ],
        variant: null
    },
    id: 1149,
    image: {
        label: 'default-shirt',
        url: 'https://example.com/media/default-shirt.jpg'
    },
    price_range: {
        maximum_price: {
            final_price: {
                currency: 'USD',
                value: 123.45
            },
            discount: {
                amount_off: 0
            }
        }
    },
    uid: 'UID001=='
};

const getProductDetailMock1 = {
    request: {
        query: defaultOperations.getProductDetailQuery,
        variables: {
            configurableOptionValues: ['red-uid'],
            sku: 'nice-shirt'
        }
    },
    result: {
        data: {
            products: {
                items: [productMock]
            }
        }
    }
};

const getProductDetailMock2 = {
    request: {
        query: defaultOperations.getProductDetailQuery,
        variables: {
            configurableOptionValues: ['red-uid', 'medium-uid'],
            sku: 'nice-shirt'
        }
    },
    result: {
        data: {
            products: {
                items: [
                    {
                        ...productMock,
                        configurable_product_options_selection: {
                            media_gallery: [],
                            variant: {
                                id: 925,
                                price_range: {
                                    maximum_price: {
                                        final_price: {
                                            currency: 'EUR',
                                            value: 456.78
                                        },
                                        discount: {
                                            amount_off: 0
                                        }
                                    }
                                },
                                uid: 'OTI1'
                            }
                        }
                    }
                ]
            }
        }
    }
};

const mockItem = {
    configurable_options: [{ id: 1, value_id: 'red-id' }],
    product: {
        name: 'Shirt',
        configurable_options: [
            {
                label: 'Color',
                attribute_id_v2: 1,
                values: [
                    { value_index: 'red-id', uid: 'red-uid', label: 'Red' },
                    { value_index: 'blue-id', uid: 'blue-uid', label: 'Blue' }
                ]
            },
            {
                label: 'Size',
                attribute_id_v2: 2,
                values: [
                    { value_index: 'large-id', uid: 'large-uid', label: 'L' },
                    { value_index: 'medium-id', uid: 'medium-uid', label: 'M' }
                ]
            }
        ],
        sku: 'nice-shirt'
    }
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
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '80',
                    default_label: 'S',
                    label: 'S',
                    store_label: 'S',
                    use_default_value: true,
                    value_index: 45
                },
                {
                    __typename: 'ConfigurableProductOptionsValues',
                    uid: '90',
                    default_label: 'XS',
                    label: 'XS',
                    store_label: 'XS',
                    use_default_value: true,
                    value_index: 46
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

const initialProps = {
    onClose: jest.fn().mockName('props.onClose')
};

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [getProductDetailMock1, getProductDetailMock2]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    return renderHook(useAddToCartDialog, { wrapper, ...renderHookOptions });
};

test('returns correct shape when closed', () => {
    const { result } = renderHookWithProviders();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "buttonProps": undefined,
          "configurableOptionProps": undefined,
          "formErrors": Array [
            undefined,
          ],
          "handleOnClose": [Function],
          "imageProps": undefined,
          "isFetchingProductDetail": false,
          "outOfStockVariants": undefined,
          "priceProps": undefined,
        }
    `);
});

test('returns configurable option props', async () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: { initialProps: { item: mockItem } }
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.configurableOptionProps).toMatchSnapshot();
});

test('returns price props', async () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: { initialProps: { item: mockItem } }
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.priceProps).toMatchInlineSnapshot(`
        Object {
          "currencyCode": "USD",
          "value": 123.45,
        }
    `);

    act(() => {
        result.current.configurableOptionProps.onSelectionChange(
            '2',
            'medium-id'
        );
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.priceProps).toMatchInlineSnapshot(`
        Object {
          "currencyCode": "EUR",
          "value": 456.78,
        }
    `);
});

test('returns image props', async () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: { initialProps: { item: mockItem } }
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.imageProps).toMatchInlineSnapshot(`
        Object {
          "alt": "red-shirt",
          "src": "https://example.com/media/red-shirt.jpg",
          "width": 400,
        }
    `);

    act(() => {
        result.current.configurableOptionProps.onSelectionChange(
            '2',
            'medium-id'
        );
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.imageProps).toMatchInlineSnapshot(`
        Object {
          "alt": "default-shirt",
          "src": "https://example.com/media/default-shirt.jpg",
          "width": 400,
        }
    `);
});

test('closing dialog resets state', async () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: { initialProps: { ...initialProps, item: mockItem } }
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(initialProps.onClose).not.toHaveBeenCalled();
    expect(result.current.imageProps).toBeTruthy();
    expect(result.current.priceProps).toBeTruthy();

    act(() => {
        result.current.handleOnClose();
    });

    expect(initialProps.onClose).toHaveBeenCalled();
    expect(result.current.imageProps).toBeUndefined();
    expect(result.current.priceProps).toBeUndefined();
});

test('addToCart succeeds and closes dialog', async () => {
    const addToCartMock = {
        request: {
            query: defaultOperations.addProductToCartMutation,
            variables: {
                cartId: '123',
                cartItem: {
                    quantity: 1,
                    selected_options: ['red-uid', 'medium-uid'],
                    sku: 'nice-shirt'
                }
            }
        },
        result: {
            data: {}
        }
    };

    const { result } = renderHookWithProviders({
        renderHookOptions: {
            initialProps: { ...initialProps, item: mockItem }
        },
        mocks: [
            getProductDetailMock1,
            getProductDetailMock1,
            getProductDetailMock2,
            addToCartMock
        ]
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    act(() => {
        result.current.configurableOptionProps.onSelectionChange(
            '2',
            'medium-id'
        );
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(initialProps.onClose).not.toHaveBeenCalled();
    expect(result.current.imageProps).toBeTruthy();
    expect(result.current.priceProps).toBeTruthy();

    act(() => {
        result.current.buttonProps.onClick();
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(initialProps.onClose).toHaveBeenCalled();
});

test('addToCart failures returns error', async () => {
    const addToCartMock = {
        request: {
            query: defaultOperations.addProductToCartMutation,
            variables: {
                cartId: '123',
                cartItem: {
                    quantity: 1,
                    selected_options: ['red-uid', 'medium-uid'],
                    sku: 'nice-shirt'
                }
            }
        },
        error: new Error('Oh noes! Something went wrong :(')
    };

    const { result } = renderHookWithProviders({
        renderHookOptions: {
            initialProps: { ...initialProps, item: mockItem }
        },
        mocks: [getProductDetailMock1, getProductDetailMock2, addToCartMock]
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    act(() => {
        result.current.configurableOptionProps.onSelectionChange(
            '2',
            'medium-id'
        );
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    act(() => {
        result.current.buttonProps.onClick();
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(initialProps.onClose).not.toHaveBeenCalled();
    expect(result.current.formErrors).toMatchInlineSnapshot(`
        Array [
          [Error: Oh noes! Something went wrong :(],
        ]
    `);
});

test('addToCart should dispatch event', async () => {
    const mockDispatch = jest.fn();

    useEventingContext.mockReturnValue([
        {},
        {
            dispatch: mockDispatch
        }
    ]);

    const addToCartMock = {
        request: {
            query: defaultOperations.addProductToCartMutation,
            variables: {
                cartId: '123',
                cartItem: {
                    quantity: 1,
                    selected_options: ['red-uid', 'medium-uid'],
                    sku: 'nice-shirt'
                }
            }
        },
        result: {
            data: {}
        }
    };

    const { result } = renderHookWithProviders({
        renderHookOptions: {
            initialProps: { ...initialProps, item: mockItem }
        },
        mocks: [
            getProductDetailMock1,
            getProductDetailMock1,
            getProductDetailMock2,
            addToCartMock
        ]
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));

        result.current.configurableOptionProps.onSelectionChange(
            '2',
            'medium-id'
        );

        await new Promise(resolve => setTimeout(resolve, 0));
        await result.current.buttonProps.onClick();
    });

    expect(mockDispatch).toBeCalledTimes(1);

    expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
});

describe('with configurable product options', () => {
    test('calls getOutOfStockVariants() with empty selections on initial render', () => {
        renderHookWithProviders({
            renderHookOptions: {
                initialProps: {
                    item: configurableProductWithTwoOptionGroupProps
                }
            }
        });
        createTestInstance(
            <renderHookWithProviders
                {...configurableProductWithTwoOptionGroupProps}
            />
        );

        expect(getOutOfStockVariants).toHaveBeenCalledTimes(1);
        // singleOptionSelection
        expect(getOutOfStockVariants.mock.calls[0][2]).toMatchInlineSnapshot(
            `undefined`
        );
        // optionSelections
        expect(getOutOfStockVariants.mock.calls[0][3]).toMatchInlineSnapshot(
            `Map {}`
        );
    });
    test('calls getOutOfStockVariants() with the correct selection values when handleSelectionChange() is called', () => {
        const { result } = renderHookWithProviders({
            renderHookOptions: {
                initialProps: {
                    item: configurableProductWithTwoOptionGroupProps
                }
            }
        });

        // Select a fashion color
        act(() => {
            result.current.configurableOptionProps.onSelectionChange('179', 14);
        });
        expect(getOutOfStockVariants).toHaveBeenCalledTimes(2);
        // singleOptionSelection
        expect(getOutOfStockVariants.mock.calls[1][2]).toMatchInlineSnapshot(`
            Map {
              "179" => 14,
            }
        `);
        // optionSelections
        expect(getOutOfStockVariants.mock.calls[1][3]).toMatchInlineSnapshot(`
            Map {
              "179" => 14,
            }
        `);

        // Select a fashion size
        act(() => {
            result.current.configurableOptionProps.onSelectionChange('190', 45);
        });
        expect(getOutOfStockVariants).toHaveBeenCalledTimes(3);
        // singleOptionSelection
        expect(getOutOfStockVariants.mock.calls[2][2]).toMatchInlineSnapshot(`
            Map {
              "190" => 45,
            }
        `);
        // optionSelections
        expect(getOutOfStockVariants.mock.calls[2][3]).toMatchInlineSnapshot(`
            Map {
              "179" => 14,
              "190" => 45,
            }
        `);
    });
});
