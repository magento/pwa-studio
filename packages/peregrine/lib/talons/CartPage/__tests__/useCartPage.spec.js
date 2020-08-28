import React, { useEffect, useState } from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useQuery } from '@apollo/client';

import { useCartPage } from '../useCartPage';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useState');

    return {
        ...React,
        useState: spy
    };
});

jest.mock('@apollo/client', () => {
    const queryResult = {
        called: false,
        data: null,
        loading: false
    };
    const useQuery = jest.fn(() => queryResult);

    return { useQuery };
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
        cartItems: expect.any(Array),
        handleSignIn: expect.any(Function),
        hasItems: expect.any(Boolean),
        isCartUpdating: expect.any(Boolean),
        isSignedIn: expect.any(Boolean),
        setIsCartUpdating: expect.any(Function),
        shouldShowLoadingIndicator: expect.any(Boolean)
    });
});

test('returns cartItems from getCartDetails query', () => {
    const cartItems = ['item1', 'item2'];
    useQuery.mockReturnValue({ data: { cart: { items: cartItems } } });
    createTestInstance(<Component />);

    expect(log.mock.calls[0][0].cartItems).toEqual(cartItems);
});

test('it calls setIsCartUpdating true when loading is true', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        called: true,
        data: { cart: { total_quantity: 0 } },
        loading: true
    });
    // isCartUpdating
    useState.mockReturnValueOnce([false, jest.fn()]);

    // Act.
    createTestInstance(<Component />);

    // Assert.
    const { setIsCartUpdating } = log.mock.calls[0][0];
    expect(setIsCartUpdating).toBeCalledWith(true);
});

test('it calls setIsCartUpdating false when loading is false', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        called: true,
        data: { cart: { total_quantity: 0 } },
        loading: false
    });
    // isCartUpdating
    useState.mockReturnValueOnce([false, jest.fn()]);

    // Act.
    createTestInstance(<Component />);

    // Assert.
    const { setIsCartUpdating } = log.mock.calls[0][0];
    expect(setIsCartUpdating).toBeCalledWith(false);
});
