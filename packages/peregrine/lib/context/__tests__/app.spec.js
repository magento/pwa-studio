import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import AppContextProvider, { useAppContext } from '../app';

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
    const contextValue = useAppContext();

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = AppContextProvider;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toBeInstanceOf(Function);
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = AppContextProvider;
    const include = { app: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual({
        appState: include.app
    });
});

test('mapDispatchToProps maps dispatch to props', () => {
    const { mapDispatchToProps } = AppContextProvider;
    const mockDispatch = jest.fn();

    mapDispatchToProps(mockDispatch);

    expect(mapDispatchToProps(mockDispatch)).toEqual({
        actions: expect.any(Object),
        asyncActions: expect.any(Object)
    });
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
        actions: { one: 'one' },
        appState: 'appState',
        asyncActions: { one: 'one', two: 'two' }
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        props.appState,
        expect.objectContaining({
            actions: props.actions,
            one: 'one',
            two: 'two'
        })
    ]);
});
