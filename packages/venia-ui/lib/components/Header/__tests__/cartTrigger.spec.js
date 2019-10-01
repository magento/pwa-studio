import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import CartTrigger from '../cartTrigger';

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
                items_qty: 10
            }
        },
        {
            ...cartApi
        }
    ]);

    const component = createTestInstance(<CartTrigger classes={classes} />);

    expect(component.toJSON()).toMatchSnapshot();
});
