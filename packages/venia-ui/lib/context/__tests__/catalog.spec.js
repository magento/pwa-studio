import React, { useContext, useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import CatalogContextProvider, { CatalogContext } from '../catalog';

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
    const contextValue = useContext(CatalogContext);

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = CatalogContextProvider;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toEqual({
        updateCategories: expect.any(Function)
    });
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = CatalogContextProvider;
    const include = { catalog: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual(include);
});

test('renders children', () => {
    const { Component } = CatalogContextProvider;
    const symbol = Symbol();
    const { root } = createTestInstance(
        <Component>
            <i symbol={symbol} />
        </Component>
    );

    expect(root.findByProps({ symbol })).toBeTruthy();
});

test('provides state and actions via context', () => {
    const { Component } = CatalogContextProvider;
    const props = {
        catalog: 'catalog',
        updateCategories: jest.fn()
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        props.catalog,
        expect.objectContaining({
            updateCategories: props.updateCategories
        })
    ]);
});
