import React from 'react';
import testRenderer from 'react-test-renderer';

import ShippingForm from '../shippingForm';

jest.mock('src/components/Select');
const availableShippingMethods = [
    {
        carrier_code: 'flatrate',
        method_code: 'flatrate',
        carrier_title: 'Flat Rate',
        method_title: 'Fixed',
        amount: 5,
        base_amount: 5,
        available: true,
        error_message: '',
        price_excl_tax: 5,
        price_incl_tax: 5
    }
];

const mockSubmit = jest.fn();
const mockCancel = jest.fn();
const defaultProps = {
    availableShippingMethods,
    cancel: mockCancel,
    submit: mockSubmit
};

beforeEach(() => {
    mockSubmit.mockReset();
    mockCancel.mockReset();
});

test('renders a shipping form', () => {
    const component = testRenderer.create(<ShippingForm {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders no initial value and no shipping methods if no availableShippingMethods', () => {
    const props = {
        ...defaultProps,
        availableShippingMethods: []
    };
    const component = testRenderer.create(<ShippingForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls props.cancel on cancel', () => {
    const component = testRenderer.create(<ShippingForm {...defaultProps} />);
    component.root.children[0].instance.cancel();
    expect(mockCancel).toHaveBeenCalled();
});

test('calls props.submit with selected shipping method matching code', () => {
    const component = testRenderer.create(<ShippingForm {...defaultProps} />);
    component.root.children[0].instance.submit({ shippingMethod: 'flatrate' });
    expect(mockSubmit).toHaveBeenCalledWith({
        shippingMethod: availableShippingMethods[0]
    });
});

test('calls props.cancel on submit if could not find matching shipping method/code', () => {
    const component = testRenderer.create(<ShippingForm {...defaultProps} />);
    component.root.children[0].instance.submit({ shippingMethod: 'UNKNOWN' });
    expect(mockCancel).toHaveBeenCalled();
});
