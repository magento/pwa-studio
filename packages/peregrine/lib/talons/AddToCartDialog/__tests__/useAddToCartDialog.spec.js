import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';

import defaultOperations from '../addToCartDialog.gql';
import { useAddToCartDialog } from '../useAddToCartDialog';
import { useEventingContext } from '../../../context/eventing';

jest.mock('../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
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
