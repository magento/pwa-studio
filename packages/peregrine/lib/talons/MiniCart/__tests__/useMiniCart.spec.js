import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useMiniCart } from '../useMiniCart';

jest.mock('@apollo/client');
jest.mock('react-router-dom', () => ({
    useHistory: jest.fn()
}));
jest.mock('../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '1234' }])
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
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

const defaultProps = {
    queries: { miniCartQuery: 'miniCartQuery' },
    mutations: { removeItemMutation: 'removeItemMutation' },
    setIsOpen: jest.fn()
};

beforeAll(() => {
    useQuery.mockReturnValue({
        data: {
            cart: {
                items: [
                    {
                        product: {
                            name: 'P1',
                            thumbnail: {
                                url: 'www.venia.com/p1'
                            }
                        },
                        id: 'p1',
                        quantity: 10,
                        configurable_options: [
                            {
                                label: 'Color',
                                value: 'red'
                            }
                        ],
                        prices: {
                            price: {
                                value: 420,
                                currency: 'USD'
                            }
                        }
                    }
                ],
                prices: { subtotal_excluding_tax: 4200 },
                total_quantity: 10
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
