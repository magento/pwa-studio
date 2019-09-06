import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import ErrorContextProvider, { useErrorContext } from '../unhandledErrors';

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
    const contextValue = useErrorContext();

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = ErrorContextProvider;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toEqual({
        markErrorHandled: expect.any(Function)
    });
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = ErrorContextProvider;
    const include = { unhandledErrors: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual({
        unhandledErrors: include.unhandledErrors
    });
});

test('renders children', () => {
    const { Component } = ErrorContextProvider;
    const symbol = Symbol();
    const { root } = createTestInstance(
        <Component>
            <i symbol={symbol} />
        </Component>
    );

    expect(root.findByProps({ symbol })).toBeTruthy();
});

test('provides state and actions via context', () => {
    const { Component } = ErrorContextProvider;
    const props = {
        markErrorHandled: 'markErrorHandled',
        unhandledErrors: 'unhandledErrors'
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        props.unhandledErrors,
        expect.objectContaining({
            markErrorHandled: props.markErrorHandled
        })
    ]);
});
