import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import CartContextProvider, { useCartContext } from '../cart';
jest.mock('@apollo/client', () => ({
    useApolloClient: jest.fn(),
    useMutation: jest.fn(() => [jest.fn()])
}));

jest.mock('react-redux', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(Component => ({
            Component: jest.fn(Component),
            mapDispatchToProps,
            mapStateToProps
        }))
    )
}));

const log = jest.fn();
const Consumer = jest.fn(() => {
    const contextValue = useCartContext();

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = CartContextProvider;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toBeInstanceOf(Function);
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = CartContextProvider;
    const include = { cart: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual({
        cartState: include.cart
    });
});

test('mapDispatchToProps maps dispatch to props', () => {
    const { mapDispatchToProps } = CartContextProvider;
    const mockDispatch = jest.fn();

    mapDispatchToProps(mockDispatch);

    expect(mapDispatchToProps(mockDispatch)).toEqual({
        actions: expect.any(Object),
        asyncActions: expect.any(Object)
    });
});

test('renders children', () => {
    const { Component } = CartContextProvider;
    const props = {
        asyncActions: { getCartDetails: jest.fn() }
    };

    const symbol = Symbol();
    const { root } = createTestInstance(
        <Component {...props}>
            <i symbol={symbol} />
        </Component>
    );

    expect(root.findByProps({ symbol })).toBeTruthy();
});

test('provides state and actions via context', () => {
    const { Component } = CartContextProvider;
    const props = {
        actions: { one: 'one' },
        cartState: { details: {} },
        asyncActions: { getCartDetails: jest.fn(), one: 'one', two: 'two' }
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        expect.any(Object),
        expect.objectContaining({
            actions: props.actions,
            one: 'one',
            two: 'two'
        })
    ]);
});

test('appends derivedDetails and isEmpty value from state with empty cart', () => {
    const { Component } = CartContextProvider;
    const props = {
        actions: { one: 'one' },
        cartState: { details: {} },
        asyncActions: { getCartDetails: jest.fn(), one: 'one', two: 'two' }
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({
            derivedDetails: {
                currencyCode: 'USD',
                numItems: 0,
                subtotal: 0
            },
            details: {},
            isEmpty: true
        }),
        expect.any(Object)
    ]);
});

test('calculates derivedDetails and isEmpty from state with cart data', () => {
    const { Component } = CartContextProvider;
    const props = {
        actions: { one: 'one' },
        cartState: {
            details: {
                items: [{ quantity: 2 }, { quantity: 3 }],
                prices: {
                    grand_total: {
                        currency: 'EUR',
                        value: 621
                    }
                }
            }
        },
        asyncActions: { getCartDetails: jest.fn(), one: 'one', two: 'two' }
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({
            derivedDetails: {
                currencyCode: 'EUR',
                numItems: 5,
                subtotal: 621
            },
            isEmpty: false
        }),
        expect.any(Object)
    ]);
});
