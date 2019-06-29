import React from 'react';
import testRenderer from 'react-test-renderer';

import Form from '../form';
import AddressForm from '../addressForm';
import PaymentsForm from '../paymentsForm';
import ShippingForm from '../shippingForm';
import Section from '../section';
import Button from 'src/components/Button';

jest.mock('src/classify');

const mockCancelCheckout = jest.fn();
const mockEditOrder = jest.fn();
const mockSubmitShippingAddress = jest.fn();
const mockSubmitOrder = jest.fn();
const mockSubmitPaymentMethodAndBillingAddress = jest.fn();
const mockSubmitShippingMethod = jest.fn();

const defaultProps = {
    cancelCheckout: mockCancelCheckout,
    cart: {
        details: {},
        cartId: '123',
        totals: {}
    },
    directory: {
        countries: []
    },
    editOrder: mockEditOrder,
    submitShippingAddress: mockSubmitShippingAddress,
    submitOrder: mockSubmitOrder,
    submitPaymentMethodAndBillingAddress: mockSubmitPaymentMethodAndBillingAddress,
    submitShippingMethod: mockSubmitShippingMethod,
    submitting: false
};

beforeEach(() => {
    mockCancelCheckout.mockReset();
    mockEditOrder.mockReset();
    mockSubmitShippingAddress.mockReset();
    mockSubmitOrder.mockReset();
    mockSubmitPaymentMethodAndBillingAddress.mockReset();
    mockSubmitShippingMethod.mockReset();
});

test('renders an overview Form component if not editing', () => {
    const component = testRenderer.create(<Form {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders an editable Form component if editing', () => {
    const props = {
        ...defaultProps,
        editing: 'address'
    };
    const component = testRenderer.create(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('dismissCheckout instance function calls props.cancelCheckout', () => {
    const component = testRenderer.create(<Form {...defaultProps} />);

    component.root.findAllByType(Button)[0].props.onClick();

    expect(mockCancelCheckout).toHaveBeenCalled();
});

test('editAddress instance function calls props.editOrder with "address"', () => {
    const component = testRenderer.create(<Form {...defaultProps} />);

    component.root.findAllByType(Section)[0].props.onClick();

    expect(mockEditOrder).toHaveBeenCalledWith('address');
});

test('editPaymentMethod instance function calls props.editOrder with "paymentMethod"', () => {
    const component = testRenderer.create(<Form {...defaultProps} />);

    component.root.findAllByType(Section)[1].props.onClick();

    expect(mockEditOrder).toHaveBeenCalledWith('paymentMethod');
});

test('editShippingMethod instance function calls props.editOrder with "shippingMethod"', () => {
    const component = testRenderer.create(<Form {...defaultProps} />);

    component.root.findAllByType(Section)[2].props.onClick();

    expect(mockEditOrder).toHaveBeenCalledWith('shippingMethod');
});

test('stopEditing instance function calls props.editOrder with null', () => {
    const component = testRenderer.create(
        <Form {...defaultProps} editing={'address'} />
    );

    component.root.findAllByType(AddressForm)[0].props.cancel();

    expect(mockEditOrder).toHaveBeenCalledWith(null);
});

test('submitShippingAddress instance function calls props.submitShippingAddress with values', () => {
    const component = testRenderer.create(
        <Form {...defaultProps} editing={'address'} />
    );

    const formValues = {
        foo: 'bar'
    };

    const form = component.root.findByType(AddressForm);
    form.props.submit(formValues);

    expect(mockSubmitShippingAddress).toHaveBeenCalledWith({
        formValues
    });
});

test('submitPaymentMethodAndBillingAddress instance function calls props.submitPaymentMethodAndBillingAddress with values', () => {
    const component = testRenderer.create(
        <Form {...defaultProps} editing={'paymentMethod'} />
    );

    const formValues = {
        foo: 'bar'
    };
    const form = component.root.findByType(PaymentsForm);
    form.props.submit(formValues);

    expect(mockSubmitPaymentMethodAndBillingAddress).toHaveBeenCalledWith({
        formValues
    });
});

test('submitShippingMethod instance function calls props.submitShippingMethod with values', () => {
    const component = testRenderer.create(
        <Form {...defaultProps} editing={'shippingMethod'} />
    );

    const formValues = {
        foo: 'bar'
    };
    const form = component.root.findByType(ShippingForm);
    form.props.submit(formValues);

    expect(mockSubmitShippingMethod).toHaveBeenCalledWith({
        formValues
    });
});

test('renders shipping method CTA if no shipping method selected', () => {
    const props = {
        ...defaultProps,
        hasShippingMethod: false
    };
    const component = testRenderer.create(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders shipping title if shipping method is selected', () => {
    const props = {
        ...defaultProps,
        hasShippingMethod: true,
        shippingTitle: 'shipping title'
    };
    const component = testRenderer.create(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders shipping address CTA if no shipping address is entered', () => {
    const props = {
        ...defaultProps,
        hasShippingAddress: false
    };
    const component = testRenderer.create(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders name and street if shipping address is entered', () => {
    const props = {
        ...defaultProps,
        hasShippingAddress: true,
        shippingAddress: {
            firstname: 'Bob',
            lastname: 'Dole',
            street: ['123 Street']
        }
    };
    const component = testRenderer.create(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders billing info CTA if no payment method is entered', () => {
    const props = {
        ...defaultProps,
        hasPaymentMethod: false
    };
    const component = testRenderer.create(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders payment method summary if payment method entered', () => {
    const props = {
        ...defaultProps,
        hasPaymentMethod: true,
        paymentData: {
            details: {
                cardType: 'VISA'
            },
            description: 'card'
        }
    };
    const component = testRenderer.create(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders empty strings if payment data is not defined', () => {
    const props = {
        ...defaultProps,
        hasPaymentMethod: true
    };
    const component = testRenderer.create(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders address form if editing prop is address', () => {
    const props = {
        ...defaultProps,
        editing: 'address'
    };

    const component = testRenderer.create(<Form {...props} />);

    expect(() => component.root.findByType(AddressForm)).not.toThrow();
    expect(() => component.root.findByType(PaymentsForm)).toThrow();
    expect(() => component.root.findByType(ShippingForm)).toThrow();
});

test('renders payments form if editing prop is paymentMethod', () => {
    const props = {
        ...defaultProps,
        editing: 'paymentMethod'
    };

    const component = testRenderer.create(<Form {...props} />);

    expect(() => component.root.findByType(AddressForm)).toThrow();
    expect(() => component.root.findByType(PaymentsForm)).not.toThrow();
    expect(() => component.root.findByType(ShippingForm)).toThrow();
});

test('renders shipping form if editing prop is shippingMethod', () => {
    const props = {
        ...defaultProps,
        editing: 'shippingMethod',
        availableShippingMethods: [],
        shippingMethod: 'flatrate'
    };

    const component = testRenderer.create(<Form {...props} />);

    expect(() => component.root.findByType(AddressForm)).toThrow();
    expect(() => component.root.findByType(PaymentsForm)).toThrow();
    expect(() => component.root.findByType(ShippingForm)).not.toThrow();
});

test('renders null if editing value is not one of allowed enums', () => {
    const props = {
        ...defaultProps,
        editing: 'INVALID'
    };

    const component = testRenderer.create(<Form {...props} />);

    expect(() => component.root.findByType(AddressForm)).toThrow();
    expect(() => component.root.findByType(PaymentsForm)).toThrow();
    expect(() => component.root.findByType(ShippingForm)).toThrow();
});
