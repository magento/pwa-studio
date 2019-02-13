import React from 'react';
import testRenderer from 'react-test-renderer';

import {
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
} from 'src/actions/checkout';
import ConnectedCheckoutWrapper from '../index';
import { CheckoutWrapper } from '../wrapper';
import Flow from '../flow';

jest.mock('src/classify');
jest.mock('../flow');
jest.mock('src/drivers', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(component => ({
            component,
            mapStateToProps,
            mapDispatchToProps
        }))
    )
}));

const defaultProps = {
    checkout: {
        step: 'cart',
        submitting: false
    },
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
};

test('returns a connected CheckoutWrapper component', () => {
    expect(ConnectedCheckoutWrapper.component).toBeInstanceOf(Function);
    expect(ConnectedCheckoutWrapper.mapStateToProps).toBeInstanceOf(Function);
    expect(ConnectedCheckoutWrapper.mapDispatchToProps).toMatchObject({
        beginCheckout,
        cancelCheckout,
        editOrder,
        submitShippingAddress,
        submitOrder,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod
    });
});

test('mapStateToProps correctly maps state to props', () => {
    const { mapStateToProps } = ConnectedCheckoutWrapper;

    const state = {
        cart: {},
        checkout: {},
        directory: {},
        extra: 'extra'
    };

    const props = mapStateToProps(state);
    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        cart: state.cart,
        checkout: state.checkout,
        directory: state.directory
    });
});

test('returns a Flow component', () => {
    const props = {
        ...defaultProps,
        cart: {
            details: {}
        }
    };
    const component = testRenderer.create(<CheckoutWrapper {...props} />);

    expect(() => component.root.findByType(Flow)).not.toThrow();
});

//TODO: I'm conflicted. The propTypes indicate that cart and checkout should
// always be defined as objects however the check in the wrapper component is
// for existence. If either of these props are falsy then we'd get a propType
// warning. So, should we remove this conditional check and rely on propTypes
// or should I just write a test and be OK with it warning every test run?
test('does not render Flow component if cart/checkout are falsy', () => {
    const props = {
        ...defaultProps,
        cart: false,
        checkout: false
    };
    const component = testRenderer.create(<CheckoutWrapper {...props} />);

    expect(() => component.root.findByType(Flow)).toThrow();
});
