import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useMiniCart } from '../useMiniCart';

import { useEventingContext } from '../../../context/eventing';
import { act } from 'react-test-renderer';

jest.mock('@apollo/client');
jest.mock('react-router-dom', () => ({
    useHistory: jest.fn()
}));
jest.mock('../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '1234' }])
}));

jest.mock('../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const Component = props => {
    const talonProps = useMiniCart(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        act(() => {
            tree.update(<Component {...{ ...props, ...newProps }} />);

            return root.findByType('i').props.talonProps;
        });
    };

    return { talonProps, tree, update };
};

const defaultProps = {
    queries: {
        miniCartQuery: 'miniCartQuery',
        getStoreConfigQuery: 'getStoreConfigQuery'
    },
    mutations: { removeItemMutation: 'removeItemMutation' },
    setIsOpen: jest.fn(),
    isOpen: false
};

beforeAll(() => {
    useQuery.mockReturnValue({
        data: {
            cart: {
                items: [
                    {
                        product: {
                            name: 'P1',
                            sku: 'sku123',
                            thumbnail: {
                                url: 'www.venia.com/p1'
                            }
                        },
                        id: 'p1',
                        quantity: 10,
                        configurable_options: [
                            {
                                label: 'Color',
                                value: 'red',
                                configurable_product_option_value_uid: 'uid123'
                            }
                        ],
                        prices: {
                            price: {
                                value: 420,
                                currency: 'USD'
                            },
                            total_item_discount: {
                                value: 2
                            }
                        }
                    }
                ],
                prices: { subtotal_excluding_tax: 4200 },
                total_quantity: 10
            },
            storeConfig: {
                store_code: 'default',
                configurable_thumbnail_source: 'parent',
                product_url_suffix: '.html'
            }
        },
        loading: false
    });
    useMutation.mockReturnValue([
        jest.fn(),
        {
            called: false,
            loading: false,
            error: {
                graphQLErrors: [
                    {
                        message: 'Hey I am a mutation error'
                    },
                    {
                        message: 'Hey I am another mutation error'
                    }
                ]
            }
        }
    ]);
    useHistory.mockReturnValue({
        push: jest.fn()
    });
});

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('handleProceedToCheckout should navigate to the checkout page and close the mini cart dialog', () => {
    const setIsOpen = jest.fn();
    const push = jest.fn();
    useHistory.mockReturnValueOnce({
        push
    });
    const props = {
        ...defaultProps,
        setIsOpen
    };
    const { talonProps } = getTalonProps(props);

    talonProps.handleProceedToCheckout();

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(push).toHaveBeenCalledWith('/checkout');
});

test('handleEditCart should navigate to the cart page and close the mini cart dialog', () => {
    const setIsOpen = jest.fn();
    const push = jest.fn();
    useHistory.mockReturnValueOnce({
        push
    });
    const props = {
        ...defaultProps,
        setIsOpen
    };
    const { talonProps } = getTalonProps(props);

    talonProps.handleEditCart();

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(push).toHaveBeenCalledWith('/cart');
});

test('should dispatch event when mini cart is open', () => {
    const mockDispatch = jest.fn();

    useEventingContext.mockReturnValue([
        {},
        {
            dispatch: mockDispatch
        }
    ]);

    const { update } = getTalonProps(defaultProps);

    expect(mockDispatch).not.toBeCalled();

    update({ isOpen: true });

    expect(mockDispatch).toBeCalledTimes(1);

    expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
});

test('closeMiniCart() should set open state to false when called', () => {
    const setIsOpen = jest.fn();

    const props = {
        ...defaultProps,
        setIsOpen
    };
    const { talonProps } = getTalonProps(props);

    talonProps.closeMiniCart();

    expect(setIsOpen).toHaveBeenCalledWith(false);
});

test('handleRemoveItem() should call graphql mutation', () => {
    const mockRemoveItem = jest.fn();

    useMutation.mockReturnValueOnce([
        mockRemoveItem,
        {
            called: false,
            loading: false,
            error: {}
        }
    ]);

    const { talonProps } = getTalonProps(defaultProps);

    expect(mockRemoveItem).not.toBeCalled();

    talonProps.handleRemoveItem('p1');

    expect(mockRemoveItem).toHaveBeenCalledTimes(1);

    expect(mockRemoveItem.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "variables": Object {
            "cartId": "1234",
            "itemId": "p1",
          },
        }
    `);
});

test('handleRemoveItem() should dispatch event', async () => {
    const mockDispatch = jest.fn();

    useEventingContext.mockReturnValue([
        {},
        {
            dispatch: mockDispatch
        }
    ]);

    const { talonProps } = getTalonProps(defaultProps);

    await talonProps.handleRemoveItem('p1');

    expect(mockDispatch).toBeCalledTimes(1);

    expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
});
