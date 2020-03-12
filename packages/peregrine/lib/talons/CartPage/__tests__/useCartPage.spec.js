import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCartPage } from '../useCartPage';

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
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});
jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});
jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

const log = jest.fn();
const Component = () => {
    const getCartDetails = {};
    const talonProps = useCartPage({
        queries: { getCartDetails }
    });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        hasItems: expect.any(Boolean),
        handleSignIn: expect.any(Function),
        isCartUpdating: expect.any(Boolean),
        isSignedIn: expect.any(Boolean),
        setIsCartUpdating: expect.any(Function)
    });
});
