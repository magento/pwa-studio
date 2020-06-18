import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { createTestInstance } from '@magento/peregrine';

import CartTrigger from '../cartTrigger';

jest.mock('@apollo/react-hooks', () => ({
    useApolloClient: jest.fn().mockImplementation(() => {}),
    useLazyQuery: jest.fn().mockReturnValue([jest.fn(), { data: null }]),
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
    const state = {};
    const api = {
        getCartDetails: jest.fn()
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

test('No counter when cart is empty', () => {
    const component = createTestInstance(<CartTrigger classes={classes} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart counter holds correct value when cart contains items', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        { data: { cart: { total_quantity: 10 } } }
    ]);

    const component = createTestInstance(<CartTrigger classes={classes} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart counter displays 99+ when items quantity is more than 99', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        { data: { cart: { total_quantity: 100 } } }
    ]);

    const component = createTestInstance(<CartTrigger classes={classes} />);

    expect(component.toJSON()).toMatchSnapshot();
});
