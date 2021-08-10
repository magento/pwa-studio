import React, { useEffect } from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import UserContextProvider, { useUserContext } from '../user';
import BrowserPersistence from '../../util/simplePersistence';

jest.mock('react-redux', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(Component => ({
            Component: jest.fn(Component),
            mapDispatchToProps,
            mapStateToProps
        }))
    )
}));

const getRawItem = jest.fn();

jest.mock('../../util/simplePersistence');

beforeEach(() => {
    const signin_token = JSON.stringify({ ttl: 3600, timeStored: Date.now() });

    getRawItem.mockReturnValue(signin_token);

    BrowserPersistence.mockImplementation(() => ({
        getRawItem
    }));
});

const log = jest.fn();
const Consumer = jest.fn(() => {
    const contextValue = useUserContext();

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = UserContextProvider;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toBeInstanceOf(Function);
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = UserContextProvider;
    const include = { user: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual({
        userState: include.user
    });
});

test('mapDispatchToProps maps dispatch to props', () => {
    const { mapDispatchToProps } = UserContextProvider;
    const mockDispatch = jest.fn();

    mapDispatchToProps(mockDispatch);

    expect(mapDispatchToProps(mockDispatch)).toEqual({
        actions: expect.any(Object),
        asyncActions: expect.any(Object)
    });
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
        actions: { one: 'one' },
        userState: 'userState',
        asyncActions: { one: 'one', two: 'two' }
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        props.userState,
        expect.objectContaining({
            actions: props.actions,
            one: 'one',
            two: 'two'
        })
    ]);
});

test('should signout if the user token has expired', () => {
    const fiveSecondsAgo = Date.now() - 5000;
    const signin_token = JSON.stringify({ ttl: 3, timeStored: fiveSecondsAgo });

    getRawItem.mockReturnValueOnce(signin_token);

    const signOut = jest.fn();

    const { Component } = UserContextProvider;
    const props = {
        actions: {},
        userState: 'userState',
        asyncActions: { signOut }
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(signOut).toHaveBeenCalled();
});

test('should not signout if the user token has not expired', () => {
    const signin_token = JSON.stringify({ ttl: 3600, timeStored: Date.now() });

    getRawItem.mockReturnValueOnce(signin_token);

    const signOut = jest.fn();

    const { Component } = UserContextProvider;
    const props = {
        actions: {},
        userState: 'userState',
        asyncActions: { signOut }
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(signOut).not.toHaveBeenCalled();
});
