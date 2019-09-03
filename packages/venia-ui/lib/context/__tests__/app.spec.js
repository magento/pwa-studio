import React, { useContext, useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import AppContextProvider, { AppContext } from '../app';

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
    const contextValue = useContext(AppContext);

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = AppContextProvider;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toEqual({
        closeDrawer: expect.any(Function)
    });
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = AppContextProvider;
    const include = { app: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual(include);
});

test('renders children', () => {
    const { Component } = AppContextProvider;
    const symbol = Symbol();
    const { root } = createTestInstance(
        <Component>
            <i symbol={symbol} />
        </Component>
    );

    expect(root.findByProps({ symbol })).toBeTruthy();
});

test('provides state and actions via context', () => {
    const { Component } = AppContextProvider;
    const props = {
        app: 'app',
        closeDrawer: jest.fn()
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        props.app,
        expect.objectContaining({
            closeDrawer: props.closeDrawer
        })
    ]);
});
