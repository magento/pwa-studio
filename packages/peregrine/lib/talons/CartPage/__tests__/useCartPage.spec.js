import React, { useEffect, useState } from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';
import { useLazyQuery } from '@apollo/client';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

import { useCartPage } from '../useCartPage';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useState');

    return {
        ...React,
        useState: spy
    };
});

jest.mock('../cartPage.gql', () => ({
    getCartDetailsQuery: 'getCartDetailsQuery'
}));

jest.mock('@apollo/client', () => {
    const queryConfig = {
        called: false,
        data: null,
        loading: false
    };
    const queryFetcher = jest.fn().mockResolvedValue(true);

    return {
        useLazyQuery: jest.fn().mockReturnValue([queryFetcher, queryConfig])
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const log = jest.fn();
const Component = () => {
    const talonProps = useCartPage();

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return <i talonProps={talonProps} />;
};

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component />);

    // Assert.
    expect(log.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "cartItems": Array [],
            "fetchCartDetails": [MockFunction] {
              "calls": Array [
                Array [
                  Object {
                    "variables": Object {
                      "cartId": "cart123",
                    },
                  },
                ],
              ],
              "results": Array [
                Object {
                  "type": "return",
                  "value": Promise {},
                },
              ],
            },
            "hasItems": false,
            "isCartUpdating": false,
            "onAddToWishlistSuccess": [Function],
            "setIsCartUpdating": [Function],
            "shouldShowLoadingIndicator": false,
            "wishlistSuccessProps": null,
          },
        ]
    `);
});

test('returns cartItems from getCartDetails query', () => {
    const cartItems = ['item1', 'item2'];
    useLazyQuery.mockReturnValueOnce([
        jest.fn().mockReturnValueOnce({ data: { cart: { items: cartItems } } }),
        {
            called: true,
            loading: false,
            data: { cart: { items: cartItems } }
        }
    ]);
    const tree = createTestInstance(<Component />);

    const { root } = tree;

    const { talonProps } = root.findByType('i').props;

    expect(talonProps.cartItems).toEqual(cartItems);
});

test('it calls setIsCartUpdating true when loading is true', () => {
    // Arrange.
    useLazyQuery.mockReturnValueOnce([
        jest
            .fn()
            .mockReturnValueOnce({ data: { cart: { total_quantity: 0 } } }),
        {
            called: true,
            loading: true
        }
    ]);
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
    useLazyQuery.mockReturnValueOnce([
        jest
            .fn()
            .mockReturnValueOnce({ data: { cart: { total_quantity: 0 } } }),
        {
            called: true,
            loading: false
        }
    ]);
    // isCartUpdating
    useState.mockReturnValueOnce([false, jest.fn()]);

    // Act.
    createTestInstance(<Component />);

    // Assert.
    const { setIsCartUpdating } = log.mock.calls[0][0];
    expect(setIsCartUpdating).toBeCalledWith(false);
});

test('onAddToWishlistSuccess should update wishlistSuccessProps', () => {
    const tree = createTestInstance(<Component />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const successProps = {
        message: 'Successfully added an item to wishlist'
    };

    act(() => {
        talonProps.onAddToWishlistSuccess(successProps);
    });

    tree.update(<Component />);
    const { talonProps: updatedTalonProps } = root.findByType('i').props;

    expect(updatedTalonProps.wishlistSuccessProps).toMatchInlineSnapshot(`
        Object {
          "message": "Successfully added an item to wishlist",
        }
    `);
});

test('should dispatch page view event', () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([
        {},
        {
            dispatch: mockDispatchEvent
        }
    ]);

    const cartItems = ['item1', 'item2'];
    useLazyQuery.mockReturnValueOnce([
        jest.fn().mockReturnValueOnce({ data: { cart: { items: cartItems } } }),
        {
            called: true,
            loading: false,
            data: { cart: { items: cartItems } }
        }
    ]);

    createTestInstance(<Component />);
    expect(mockDispatchEvent).toBeCalledTimes(1);

    expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
});
