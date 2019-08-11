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

test('renders a disabled Checkout Button component', () => {
    const props = {
        disabled: true
    };
    const component = testRenderer.create(<CheckoutButton {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
