import React, { useContext, useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import CheckoutContextProvider, { CheckoutContext } from '../checkout';

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
    const contextValue = useContext(CheckoutContext);

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i />;
});

const fromEntries = array => {
    const object = {};

    for (const [key, value] of array) {
        object[key] = value;
    }

    return object;
};

const actionCreators = [
    'beginCheckout',
    'cancelCheckout',
    'getShippingMethods',
    'resetCheckout',
    'submitBillingAddress',
    'submitOrder',
    'submitPaymentMethod',
    'submitPaymentMethodAndBillingAddress',
    'submitShippingAddress',
    'submitShippingMethod'
];

test('returns a connected component', () => {
    const { mapDispatchToProps, mapStateToProps } = CheckoutContextProvider;
    const expectedApi = fromEntries(
        actionCreators.map(key => [key, expect.any(Function)])
    );

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toEqual(expectedApi);
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = CheckoutContextProvider;
    const include = { checkout: 'a' };
    const exclude = { foo: 'b' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual(include);
});

test('renders children', () => {
    const { Component } = CheckoutContextProvider;
    const symbol = Symbol();
    const { root } = createTestInstance(
        <Component>
            <i symbol={symbol} />
        </Component>
    );

    expect(root.findByProps({ symbol })).toBeTruthy();
});

test('provides state and actions via context', () => {
    const { Component } = CheckoutContextProvider;
    const expectedApi = fromEntries(
        actionCreators.map(key => [key, jest.fn()])
    );
    const props = {
        checkout: 'checkout',
        ...expectedApi
    };

    createTestInstance(
        <Component {...props}>
            <Consumer />
        </Component>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, [
        props.checkout,
        expect.objectContaining(expectedApi)
    ]);
});
