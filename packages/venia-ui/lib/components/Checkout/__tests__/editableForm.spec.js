import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import EditableForm from '../editableForm';
import AddressForm from '../addressForm';
import PaymentsForm from '../paymentsForm';
import ShippingForm from '../shippingForm';

jest.mock('../../../classify');
jest.mock('../addressForm', () => 'AddressForm');
jest.mock('../paymentsForm', () => 'PaymentsForm');
jest.mock('../shippingForm', () => 'ShippingForm');

const mockSetEditing = jest.fn();
const mockSubmitShippingAddress = jest.fn();
const mockSubmitShippingMethod = jest.fn();
const mockSubmitPaymentMethodAndBillingAddress = jest.fn();

const defaultProps = {
    checkout: {},
    setEditing: mockSetEditing,
    submitShippingAddress: mockSubmitShippingAddress,
    submitShippingMethod: mockSubmitShippingMethod,
    submitPaymentMethodAndBillingAddress: mockSubmitPaymentMethodAndBillingAddress
};

beforeEach(() => {
    mockSetEditing.mockReset();
    mockSubmitShippingAddress.mockReset();
    mockSubmitShippingMethod.mockReset();
    mockSubmitPaymentMethodAndBillingAddress.mockReset();
});

test('renders an null Editable Form component', () => {
    const component = createTestInstance(<EditableForm {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders an AddressForm component if editing address', () => {
    const props = {
        ...defaultProps,
        editing: 'address'
    };
    const component = createTestInstance(<EditableForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Payment Form component if editing paymentMethod', () => {
    const props = {
        ...defaultProps,
        editing: 'paymentMethod'
    };
    const component = createTestInstance(<EditableForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders an ShippingForm component if editing shippingMethod', () => {
    const props = {
        ...defaultProps,
        editing: 'shippingMethod'
    };
    const component = createTestInstance(<EditableForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('submit payments form calls action with type and values', () => {
    const props = {
        ...defaultProps,
        editing: 'paymentMethod'
    };
    const component = createTestInstance(<EditableForm {...props} />);
    const formValues = {
        foo: 'bar'
    };

    act(() => {
        component.root.findByType(PaymentsForm).props.onSubmit(formValues);
    });

    expect(mockSubmitPaymentMethodAndBillingAddress).toHaveBeenCalledWith({
        formValues
    });
});

test('submit shipping form calls action with type and values', () => {
    const props = {
        ...defaultProps,
        editing: 'shippingMethod'
    };
    const component = createTestInstance(<EditableForm {...props} />);
    const formValues = {
        foo: 'bar'
    };

    act(() => {
        component.root.findByType(ShippingForm).props.onSubmit(formValues);
    });

    expect(mockSubmitShippingMethod).toHaveBeenCalledWith({
        formValues
    });
});

test('renders shipping method CTA if no shipping method selected', () => {
    const props = {
        ...defaultProps,
        hasShippingMethod: false
    };
    const component = createTestInstance(<EditableForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders shipping title if shipping method is selected', () => {
    const props = {
        ...defaultProps,
        hasShippingMethod: true,
        shippingTitle: 'shipping title'
    };
    const component = createTestInstance(<EditableForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders shipping address CTA if no shipping address is entered', () => {
    const props = {
        ...defaultProps,
        hasShippingAddress: false
    };
    const component = createTestInstance(<EditableForm {...props} />);

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
    const component = createTestInstance(<EditableForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders billing info CTA if no payment method is entered', () => {
    const props = {
        ...defaultProps,
        hasPaymentMethod: false
    };
    const component = createTestInstance(<EditableForm {...props} />);

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
    const component = createTestInstance(<EditableForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders empty strings if payment data is not defined', () => {
    const props = {
        ...defaultProps,
        hasPaymentMethod: true
    };
    const component = createTestInstance(<EditableForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders null if editing value is not one of allowed enums', () => {
    const props = {
        ...defaultProps,
        editing: 'INVALID'
    };

    const component = createTestInstance(<EditableForm {...props} />);

    expect(() => component.root.findByType(AddressForm)).toThrow();
    expect(() => component.root.findByType(PaymentsForm)).toThrow();
    expect(() => component.root.findByType(ShippingForm)).toThrow();
});
