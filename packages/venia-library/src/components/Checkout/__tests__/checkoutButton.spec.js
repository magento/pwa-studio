import React from 'react';
import testRenderer from 'react-test-renderer';
import CheckoutButton from '../checkoutButton';

test('renders a Checkout Button component', () => {
    const props = {
        ready: false
    };
    const component = testRenderer.create(<CheckoutButton {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('sets disabled true if submitting', () => {
    const props = {
        ready: false,
        submitting: true
    };
    const component = testRenderer.create(<CheckoutButton {...props} />);
    expect(component.toJSON().props.disabled).toBe(true);
});

test('sets disabled true if not submitting and not ready', () => {
    const props = {
        ready: false,
        submitting: false
    };
    const component = testRenderer.create(<CheckoutButton {...props} />);
    expect(component.toJSON().props.disabled).toBe(true);
});

test('sets disabled false if not submitting and ready', () => {
    const props = {
        ready: true,
        submitting: false
    };
    const component = testRenderer.create(<CheckoutButton {...props} />);
    expect(component.toJSON().props.disabled).toBe(false);
});
