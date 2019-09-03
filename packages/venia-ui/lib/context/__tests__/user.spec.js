import React, { useContext, useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import UserContextProvider, { UserContext } from '../user';

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
    const contextValue = useContext(UserContext);

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = UserContextProvider;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toEqual({
        createAccount: expect.any(Function),
        getUserDetails: expect.any(Function),
        signIn: expect.any(Function),
        signOut: expect.any(Function)
    });
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = UserContextProvider;
    const include = { user: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual(include);
});

test('renders children', () => {
    const { Component } = UserContextProvider;
    const symbol = Symbol();
    const { root } = createTestInstance(
        <Component>
            <i symbol={symbol} />
        </Component>
    );

    expect(root.findByProps({ symbol })).toBeTruthy();
});

test('provides state and actions via context', () => {
    const { Component } = UserContextProvider;
    const props = {
        user: 'user',
        createAccount: jest.fn(),
        getUserDetails: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn()
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        props.user,
        expect.objectContaining({
            createAccount: props.createAccount,
            getUserDetails: props.getUserDetails,
            signIn: props.signIn,
            signOut: props.signOut
        })
    ]);
});
