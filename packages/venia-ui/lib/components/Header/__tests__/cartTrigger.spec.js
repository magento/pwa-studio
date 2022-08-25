import React from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { createTestInstance } from '@magento/peregrine';

import CartTrigger from '../cartTrigger';
import { IntlProvider } from 'react-intl';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useApolloClient: jest.fn().mockImplementation(() => {}),
    useQuery: jest.fn().mockReturnValue({ data: null }),
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn().mockReturnValue({
            push: jest.fn()
        }),
        useLocation: jest.fn().mockReturnValue({
            pathname: '/'
        })
    };
});

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

jest.mock('../../MiniCart', () => 'MiniCart Component');

const classes = {
    root: 'a'
};

test('No counter when cart is empty', () => {
    const component = createTestInstance(
        <IntlProvider locale="en-US">
            <CartTrigger classes={classes} />
        </IntlProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart icon svg has fill and correct value when cart contains items', () => {
    useQuery.mockReturnValueOnce({ data: { cart: { total_quantity: 10 } } });

    const component = createTestInstance(
        <IntlProvider locale="en-US">
            <CartTrigger classes={classes} />
        </IntlProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart counter displays 99+ when items quantity is more than 99', () => {
    useQuery.mockReturnValueOnce({ data: { cart: { total_quantity: 100 } } });

    const component = createTestInstance(
        <IntlProvider locale="en-US">
            <CartTrigger classes={classes} />
        </IntlProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart trigger should not be rendered on the checkout page', () => {
    useLocation.mockReturnValueOnce({
        pathname: '/checkout'
    });

    const component = createTestInstance(
        <IntlProvider locale="en-US">
            <CartTrigger classes={classes} />
        </IntlProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
});
