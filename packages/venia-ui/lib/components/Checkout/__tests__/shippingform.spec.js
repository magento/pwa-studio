import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';
import Button from '../../Button';
import ShippingForm from '../shippingForm';

jest.mock('../../Select', () => 'Select');
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
    onCancel: mockCancel,
    onSubmit: mockSubmit
};

beforeEach(() => {
    mockSubmit.mockReset();
    mockCancel.mockReset();
});

test('renders a shipping form', () => {
    const component = createTestInstance(<ShippingForm {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders no initial value and no shipping methods if no availableShippingMethods', () => {
    const props = {
        ...defaultProps,
        availableShippingMethods: []
    };
    const component = createTestInstance(<ShippingForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls props.cancel on cancel', () => {
    const component = createTestInstance(<ShippingForm {...defaultProps} />);
    const button = component.root.findAllByType(Button)[1];
    button.props.onClick();
    expect(mockCancel).toHaveBeenCalled();
});

test('calls props.submit with selected shipping method matching code', () => {
    const component = createTestInstance(<ShippingForm {...defaultProps} />);
    const form = component.root.findByType(Form);
    form.props.onSubmit({ shippingMethod: 'flatrate' });
    expect(mockSubmit).toHaveBeenCalledWith({
        shippingMethod: availableShippingMethods[0]
    });
});

test('calls props.cancel on submit if could not find matching shipping method/code', () => {
    const component = createTestInstance(<ShippingForm {...defaultProps} />);
    const form = component.root.findByType(Form);
    form.props.onSubmit({ shippingMethod: 'UNKNOWN' });
    expect(mockCancel).toHaveBeenCalled();
});
