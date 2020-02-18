import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import CartContextProvider, { useCartContext } from '../cart';

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
        actions: { one: 'one' },
        cartState: { details: {} },
        asyncActions: { one: 'one', two: 'two' }
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
        asyncActions: { one: 'one', two: 'two' }
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
                appliedTaxes: [],
                discounts: null,
                numItems: 0,
                subtotalExcludingTax: 0,
                subtotalIncludingTax: 0,
                subtotalWithDiscountExcludingTax: 0,
                grandTotal: 0,
                currencyCode: 'USD',
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
                    applied_taxes: [],
                    discounts: null,
                    grand_total: {
                        currency: 'USD',
                        value: 621,
                    },
                    subtotal_excluding_tax: {
                        currency: 'USD',
                        value: 611,
                    },
                    subtotal_including_tax: {
                        currency: 'USD',
                        value: 621,
                    },
                    subtotal_with_discount_excluding_tax: {
                        currency: 'USD',
                        value: 601,
                    }
                }
            }
        },
        asyncActions: { one: 'one', two: 'two' }
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
                appliedTaxes: [],
                discounts: null,
                numItems: 5,
                subtotalExcludingTax: 611,
                subtotalIncludingTax: 621,
                subtotalWithDiscountExcludingTax: 601,
                grandTotal: 621,
                currencyCode: 'USD',
            },
            isEmpty: false
        }),
        expect.any(Object)
    ]);
});
