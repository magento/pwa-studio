import React from 'react';
import testRenderer from 'react-test-renderer';

import PaymentsForm from '../paymentsForm';
import { Form } from 'informed';
import BraintreeDropin from '../braintreeDropin';

jest.mock('src/classify');

const mockCancel = jest.fn();
const mockSubmit = jest.fn();
const defaultProps = {
    cancel: mockCancel,
    submit: mockSubmit
};

beforeEach(() => {
    mockCancel.mockReset();
    mockSubmit.mockReset();
});
test('renders a PaymentsForm component', () => {
    const component = testRenderer.create(<PaymentsForm {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('sets addresses_same true if no initial form values', () => {
    const props = {
        ...defaultProps,
        initialValues: {}
    };
    const component = testRenderer.create(<PaymentsForm {...props} />);

    expect(
        component.root.findByType(Form).props.initialValues.addresses_same
    ).toEqual(true);
});

test('sets addresses_same true if initialValues.sameAsShippingAddress is true', () => {
    const props = {
        ...defaultProps,
        initialValues: {
            sameAsShippingAddress: true
        }
    };
    const component = testRenderer.create(<PaymentsForm {...props} />);

    expect(
        component.root.findByType(Form).props.initialValues.addresses_same
    ).toEqual(true);
});

test('sets addresses_same false if initialValues.sameAsShippingAddress is false', () => {
    const props = {
        ...defaultProps,
        initialValues: {
            sameAsShippingAddress: false
        }
    };
    const component = testRenderer.create(<PaymentsForm {...props} />);

    expect(
        component.root.findByType(Form).props.initialValues.addresses_same
    ).toEqual(false);
});

test('renders billing address fields if addresses_same checkbox unchecked', () => {
    const props = {
        ...defaultProps,
        initialValues: {
            sameAsShippingAddress: false
        }
    };
    const component = testRenderer.create(<PaymentsForm {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
    expect(component.root.findByProps({ className: 'street0' })).toBeTruthy();
});

test('setPaymentNonce function submits billing address and payment method', () => {
    const props = {
        ...defaultProps,
        initialValues: {
            sameAsShippingAddress: true
        }
    };
    const component = testRenderer.create(<PaymentsForm {...props} />);

    const testNonce = 'testData';
    component.root.children[0].instance.setPaymentNonce(testNonce);

    expect(mockSubmit).toHaveBeenCalledWith({
        billingAddress: {
            sameAsShippingAddress: true
        },
        paymentMethod: {
            code: 'braintree',
            data: testNonce
        }
    });
});

test('setPaymentNonce function gets billing address from form if not same as shipping', () => {
    const props = {
        ...defaultProps,
        initialValues: {
            sameAsShippingAddress: false
        }
    };
    const component = testRenderer.create(<PaymentsForm {...props} />);

    const testNonce = 'testData';
    component.root.children[0].instance.setPaymentNonce(testNonce);

    expect(mockSubmit).toHaveBeenCalledWith({
        billingAddress: {
            city: undefined,
            postcode: undefined,
            region_code: undefined,
            street: undefined
        },
        paymentMethod: {
            code: 'braintree',
            data: testNonce
        }
    });
});

test('cancel instance function calls props cancel function', () => {
    const component = testRenderer.create(<PaymentsForm {...defaultProps} />);
    component.root.children[0].instance.cancel();

    expect(mockCancel).toHaveBeenCalled();
});

test('submit instance function sets isRequestingPaymentNonce true in state', () => {
    const component = testRenderer.create(<PaymentsForm {...defaultProps} />);

    component.root.children[0].instance.submit();

    expect(
        component.root.findByType(BraintreeDropin).props
            .isRequestingPaymentNonce
    ).toEqual(true);
});

test('cancelPaymentNonceRequest instance function sets isRequestingPaymentNonce false in state', () => {
    const component = testRenderer.create(<PaymentsForm {...defaultProps} />);

    component.root.children[0].instance.cancelPaymentNonceRequest();

    expect(
        component.root.findByType(BraintreeDropin).props
            .isRequestingPaymentNonce
    ).toEqual(false);
});
