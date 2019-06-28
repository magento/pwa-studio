import React, { useState } from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import Form from '../form';
import AddressForm from '../addressForm';
import PaymentsForm from '../paymentsForm';
import ShippingForm from '../shippingForm';
import Section from '../section';
import Button from 'src/components/Button';

jest.mock('src/classify');
jest.mock('../addressForm', () => 'AddressForm');
jest.mock('../paymentsForm', () => 'PaymentsForm');
jest.mock('../shippingForm', () => 'ShippingForm');
jest.mock('react', () => {
    const React = jest.requireActual('react');
    return Object.assign(React, { useState: jest.fn(React.useState) });
});

const mockCancelCheckout = jest.fn();
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
    submitShippingAddress: mockSubmitShippingAddress,
    submitOrder: mockSubmitOrder,
    submitPaymentMethodAndBillingAddress: mockSubmitPaymentMethodAndBillingAddress,
    submitShippingMethod: mockSubmitShippingMethod,
    submitting: false
};

beforeEach(() => {
    mockCancelCheckout.mockReset();
    mockSubmitShippingAddress.mockReset();
    mockSubmitOrder.mockReset();
    mockSubmitPaymentMethodAndBillingAddress.mockReset();
    mockSubmitShippingMethod.mockReset();
});

test('renders an overview Form component if not editing', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('dismissing the form cancels checkout', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Button)[0].props.onClick();
    });

    expect(mockCancelCheckout).toHaveBeenCalled();
});

test('clicking address form edit sets `editing` state value to "address"', () => {
    const mockSetEditing = jest.fn();
    useState.mockReturnValueOnce([null, mockSetEditing]);

    const component = createTestInstance(<Form {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[0].props.onClick();
    });

    expect(mockSetEditing).toHaveBeenCalledWith('address');
});

test('clicking payment form edit sets `editing` state value to "paymentMethod"', () => {
    const mockSetEditing = jest.fn();
    useState.mockReturnValueOnce([null, mockSetEditing]);

    const component = createTestInstance(<Form {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[1].props.onClick();
    });

    expect(mockSetEditing).toHaveBeenCalledWith('paymentMethod');
});

test('clicking shipping form edit sets `editing` state value to "shippingMethod"', () => {
    const mockSetEditing = jest.fn();
    useState.mockReturnValueOnce([null, mockSetEditing]);

    const component = createTestInstance(<Form {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[2].props.onClick();
    });

    expect(mockSetEditing).toHaveBeenCalledWith('shippingMethod');
});

test('renders and closes address form', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[0].props.onClick();
    });

    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component.root.findByType(AddressForm).props.cancel();
    });

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders and closes payment form', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[1].props.onClick();
    });
    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component.root.findByType(PaymentsForm).props.cancel();
    });

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders and closes shipping method form', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[2].props.onClick();
    });

    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component.root.findByType(ShippingForm).props.cancel();
    });

    expect(component.toJSON()).toMatchSnapshot();
});

// TODO: Update act with async when React 16.9.0 is released
test('submit address form calls action with type and values', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    const formValues = {
        foo: 'bar'
    };

    act(() => {
        component.root.findAllByType(Section)[0].props.onClick();
    });

    act(() => {
        component.root.findByType(AddressForm).props.submit(formValues);
    });

    expect(mockSubmitShippingAddress).toHaveBeenCalledWith({
        formValues
    });
});

// TODO: Update act with async when React 16.9.0 is released
test('submit payments form calls action with type and values', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    const formValues = {
        foo: 'bar'
    };

    act(() => {
        component.root.findAllByType(Section)[1].props.onClick();
    });

    act(() => {
        component.root.findByType(PaymentsForm).props.submit(formValues);
    });

    expect(mockSubmitPaymentMethodAndBillingAddress).toHaveBeenCalledWith({
        formValues
    });
});

// TODO: Update act with async when React 16.9.0 is released
test('submit shipping form calls action with type and values', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    const formValues = {
        foo: 'bar'
    };

    act(() => {
        component.root.findAllByType(Section)[2].props.onClick();
    });

    act(() => {
        component.root.findByType(ShippingForm).props.submit(formValues);
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
    const component = createTestInstance(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders shipping title if shipping method is selected', () => {
    const props = {
        ...defaultProps,
        hasShippingMethod: true,
        shippingTitle: 'shipping title'
    };
    const component = createTestInstance(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders shipping address CTA if no shipping address is entered', () => {
    const props = {
        ...defaultProps,
        hasShippingAddress: false
    };
    const component = createTestInstance(<Form {...props} />);

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
    const component = createTestInstance(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders billing info CTA if no payment method is entered', () => {
    const props = {
        ...defaultProps,
        hasPaymentMethod: false
    };
    const component = createTestInstance(<Form {...props} />);

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
    const component = createTestInstance(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders empty strings if payment data is not defined', () => {
    const props = {
        ...defaultProps,
        hasPaymentMethod: true
    };
    const component = createTestInstance(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders null if editing value is not one of allowed enums', () => {
    const props = {
        ...defaultProps,
        editing: 'INVALID'
    };

    const component = createTestInstance(<Form {...props} />);

    expect(() => component.root.findByType(AddressForm)).toThrow();
    expect(() => component.root.findByType(PaymentsForm)).toThrow();
    expect(() => component.root.findByType(ShippingForm)).toThrow();
});
