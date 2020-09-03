import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import Overview from '../overview';
import Section from '../section';

jest.mock('../../../classify');
jest.mock('../paymentMethodSummary', () => 'PaymentMethodSummary');
jest.mock('../shippingAddressSummary', () => 'ShippingAddressSummary');
jest.mock('../shippingMethodSummary', () => 'shippingMethodSummary');

const mockCancelCheckout = jest.fn();
const mockSetEditing = jest.fn();
const mockSubmitOrder = jest.fn();

const defaultProps = {
    cancelCheckout: mockCancelCheckout,
    cart: {
        cartId: '123',
        derivedDetails: {
            currencyCode: 'USD',
            numItems: 0,
            subtotal: 0
        },
        details: {}
    },
    classes: {
        body: 'body',
        footer: 'footer'
    },
    setEditing: mockSetEditing,
    submitOrder: mockSubmitOrder,
    submitting: false
};

beforeEach(() => {
    mockCancelCheckout.mockReset();
    mockSetEditing.mockReset();
    mockSubmitOrder.mockReset();
});

test('renders an Overview component', () => {
    const component = createTestInstance(<Overview {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('Confirm Order button is disabled if submitting', () => {
    const props = {
        ...defaultProps,
        submitting: true
    };
    const component = createTestInstance(<Overview {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('Confirm Order button is disabled if not ready', () => {
    const props = {
        ...defaultProps,
        ready: false
    };
    const component = createTestInstance(<Overview {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('clicking address form edit sets `editing` state value to "address"', () => {
    const component = createTestInstance(<Overview {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[0].props.onClick();
    });

    expect(mockSetEditing).toHaveBeenCalledWith('address');
});

test('clicking payment form edit sets `editing` state value to "paymentMethod"', () => {
    const component = createTestInstance(<Overview {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[1].props.onClick();
    });

    expect(mockSetEditing).toHaveBeenCalledWith('paymentMethod');
});

test('clicking shipping form edit sets `editing` state value to "shippingMethod"', () => {
    const component = createTestInstance(<Overview {...defaultProps} />);

    act(() => {
        component.root.findAllByType(Section)[2].props.onClick();
    });

    expect(mockSetEditing).toHaveBeenCalledWith('shippingMethod');
});
