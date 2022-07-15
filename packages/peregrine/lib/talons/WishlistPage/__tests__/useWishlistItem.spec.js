import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useMutation } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useWishlistItem } from '../useWishlistItem';
import { useEventingContext } from '../../../context/eventing';

jest.mock('@apollo/client', () => {
    const ApolloClient = jest.requireActual('@apollo/client');

    return {
        ...ApolloClient,
        useMutation: jest.fn().mockReturnValue([jest.fn(), { loading: false }])
    };
});

jest.mock('../../../context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const log = jest.fn();
const Component = props => {
    const talonProps = useWishlistItem({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const baseProps = {
    mutations: {},
    item: {
        id: 'item-1',
        product: {
            image: {
                label: 'Shoggoth Shirt',
                url: 'https://example.com/media/shoggoth-shirt.jpg'
            },
            sku: 'shoggoth-shirt',
            stock_status: 'IN_STOCK',
            name: 'Product Name',
            price_range: {
                maximum_price: {
                    final_price: {
                        currency: 'USD',
                        value: 99
                    },
                    discount: {
                        amount_off: 10
                    }
                }
            }
        }
    },
    onOpenAddToCartDialog: jest.fn().mockName('onOpenAddToCartDialog'),
    wishlistId: 'wishlist-1'
};

test('it returns the correct shape', () => {
    createTestInstance(<Component {...baseProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
});

test('it returns mutation response fields', () => {
    useMutation.mockReturnValue([jest.fn(), { error: {}, loading: true }]);
    createTestInstance(<Component {...baseProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps.hasError).toBe(true);
    expect(talonProps.addToCartButtonProps.disabled).toBe(true);
});

test('mutation passes options for simple item', () => {
    createTestInstance(<Component {...baseProps} />);

    const mutationOptions = useMutation.mock.calls[0][1];

    expect(mutationOptions).toMatchSnapshot();
});

test('mutation passes options for configurable item', () => {
    const configurableProps = {
        ...baseProps,
        item: {
            ...baseProps.item,
            configurable_options: [
                {
                    id: 'option-1',
                    value_id: 'value-1'
                }
            ],
            product: {
                ...baseProps.item.product,
                configurable_options: [
                    {
                        attribute_id_v2: 'option-1',
                        values: [
                            { value_index: 'value-1', uid: 'value-uid-1' },
                            { value_index: 'value-2', uid: 'value-uid-2' }
                        ]
                    }
                ]
            }
        }
    };
    createTestInstance(<Component {...configurableProps} />);

    const mutationOptions = useMutation.mock.calls[0][1];

    expect(mutationOptions).toMatchSnapshot();
});

test('handleAddToCart callback fires mutation', () => {
    const mockMutate = jest.fn();
    useMutation.mockReturnValue([mockMutate, { loading: false }]);
    createTestInstance(<Component {...baseProps} />);

    const talonProps = log.mock.calls[0][0];

    act(() => {
        talonProps.addToCartButtonProps.onClick();
    });

    expect(mockMutate).toHaveBeenCalled();
});

test('handleAddToCart callback should dispatch event', async () => {
    const mockDispatch = jest.fn();
    useEventingContext.mockReturnValue([
        {},
        {
            dispatch: mockDispatch
        }
    ]);

    createTestInstance(<Component {...baseProps} />);

    const talonProps = log.mock.calls[0][0];

    await act(async () => {
        await talonProps.addToCartButtonProps.onClick();
    });

    expect(mockDispatch).toBeCalledTimes(1);

    expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
});

test('handleRemoveProductFromWishlist callback fires mutation', () => {
    const mockMutate = jest.fn();
    useMutation.mockReturnValue([mockMutate, { loading: false }]);
    createTestInstance(<Component {...baseProps} />);

    const talonProps = log.mock.calls[0][0];

    act(() => {
        talonProps.handleRemoveProductFromWishlist();
    });

    expect(mockMutate).toHaveBeenCalled();
});

test('handleRemoveProductFromWishlist callback logs error if the mutation fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const error = new Error('Error.');
    const mockMutate = jest.fn(() => {
        throw error;
    });
    useMutation.mockReturnValue([
        mockMutate,
        {
            called: true,
            error: error,
            loading: false
        }
    ]);
    createTestInstance(<Component {...baseProps} />);
    const talonProps = log.mock.calls[0][0];
    act(() => {
        talonProps.handleRemoveProductFromWishlist();
    });
    expect(consoleErrorSpy).toHaveBeenCalled();
});

test('disables addToCart button when out of stock', () => {
    const outOfStockProps = {
        ...baseProps,
        item: {
            ...baseProps.item,
            product: {
                ...baseProps.item.product,
                stock_status: 'OUT_OF_STOCK'
            }
        }
    };

    createTestInstance(<Component {...outOfStockProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps.addToCartButtonProps.disabled).toBe(true);
});

test('fires open dialog callback if not configured', () => {
    const mockMutate = jest.fn();
    useMutation.mockReturnValue([mockMutate, { loading: false }]);

    const configurableProps = {
        ...baseProps,
        item: {
            ...baseProps.item,
            configurable_options: [],
            product: {
                ...baseProps.item.product,
                configurable_options: [
                    {
                        attribute_id_v2: 'option-1',
                        values: [
                            { value_index: 'value-1', uid: 'value-uid-1' },
                            { value_index: 'value-2', uid: 'value-uid-2' }
                        ]
                    }
                ]
            }
        }
    };

    createTestInstance(<Component {...configurableProps} />);
    const talonProps = log.mock.calls[0][0];

    act(() => {
        talonProps.addToCartButtonProps.onClick();
    });

    expect(mockMutate).not.toHaveBeenCalled();
    expect(baseProps.onOpenAddToCartDialog).toHaveBeenCalled();
});

test('test if cache clean works', () => {
    const mockMutate = jest.fn();
    useMutation.mockReturnValue([mockMutate, { loading: false }]);

    createTestInstance(<Component {...baseProps} />);

    const { update } = useMutation.mock.calls[1][1];
    const talonProps = log.mock.calls[0][0];

    const cache = {};
    cache.modify = jest.fn();
    update(cache);
    expect(cache.modify.mock.calls.length).toBe(2);

    act(() => {
        talonProps.handleRemoveProductFromWishlist();
    });

    expect(mockMutate).toHaveBeenCalled();
});
