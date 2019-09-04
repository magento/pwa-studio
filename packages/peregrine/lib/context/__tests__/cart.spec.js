import React, { useContext, useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import CartContextProvider, { CartContext } from '../cart';

jest.mock('@magento/venia-drivers', () => ({
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
    const contextValue = useContext(CartContext);

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = CartContextProvider;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toEqual({
        addItemToCart: expect.any(Function),
        beginEditItem: expect.any(Function),
        createCart: expect.any(Function),
        endEditItem: expect.any(Function),
        getCartDetails: expect.any(Function),
        removeItemFromCart: expect.any(Function),
        updateItemInCart: expect.any(Function)
    });
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = CartContextProvider;
    const include = { cart: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual(include);
});

test('renders children', () => {
    const { Component } = CartContextProvider;
    const symbol = Symbol();
    const { root } = createTestInstance(
        <Component>
            <i symbol={symbol} />
        </Component>
    );

    expect(root.findByProps({ symbol })).toBeTruthy();
});

test('provides state and actions via context', () => {
    const { Component } = CartContextProvider;
    const props = {
        cart: 'cart',
        addItemToCart: jest.fn(),
        beginEditItem: jest.fn(),
        createCart: jest.fn(),
        endEditItem: jest.fn(),
        getCartDetails: jest.fn(),
        removeItemFromCart: jest.fn(),
        updateItemInCart: jest.fn()
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        props.cart,
        expect.objectContaining({
            addItemToCart: props.addItemToCart,
            beginEditItem: props.beginEditItem,
            createCart: props.createCart,
            endEditItem: props.endEditItem,
            getCartDetails: props.getCartDetails,
            removeItemFromCart: props.removeItemFromCart,
            updateItemInCart: props.updateItemInCart
        })
    ]);
});
