import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import CartTrigger from '../cartTrigger';

jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { toggleDrawer: jest.fn() };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        details: {}
    };
    const api = {
        getCartDetails: jest.fn(),
        toggleCart: jest.fn()
    };

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest.fn().mockResolvedValue({ data: { cart: {} } });

    return { useAwaitQuery };
});

const classes = {
    root: 'a'
};

test('Cart icon svg has no fill when cart is empty', () => {
    const [cartState, cartApi] = useCartContext();
    useCartContext.mockReturnValueOnce([
        {
            ...cartState,
            details: {
                items_qty: 0
            }
        },
        {
            ...cartApi
        }
    ]);

    const component = createTestInstance(<CartTrigger classes={classes} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart icon svg has fill and correct value when cart contains items', () => {
    const [cartState, cartApi] = useCartContext();
    useCartContext.mockReturnValueOnce([
        {
            ...cartState,
            details: {
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }
        },
        {
            ...cartApi
        }
    ]);

    const component = createTestInstance(<CartTrigger classes={classes} />);

    expect(component.toJSON()).toMatchSnapshot();
});
