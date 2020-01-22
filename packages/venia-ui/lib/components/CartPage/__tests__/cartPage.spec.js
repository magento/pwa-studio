import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import CartPage from '../cartPage';
import { useLazyQuery } from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };
    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return { useLazyQuery };
});

jest.mock('@magento/peregrine/lib/context/app', () => {
    const api = {
        toggleDrawer: jest.fn()
    };
    const state = {};
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const api = {};
    const state = { cartId: 'cart123' };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const api = {};
    const state = { isSignedIn: false };
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

test('renders no price adjustments or summary components if cart is empty', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            data: {
                cart: {
                    total_quantity: 0
                }
            }
        }
    ]);

    const instance = createTestInstance(<CartPage />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders price adjustments and summary components if cart has items', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            data: {
                cart: {
                    total_quantity: 1
                }
            }
        }
    ]);

    const instance = createTestInstance(<CartPage />);
    expect(instance.toJSON()).toMatchSnapshot();
});
