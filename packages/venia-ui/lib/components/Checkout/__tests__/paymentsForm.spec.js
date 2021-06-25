import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import PaymentsForm from '../paymentsForm';
import { Form } from 'informed';
import BraintreeDropin from '../braintreeDropin';
import Button from '../../Button';

jest.mock('../../../classify');
jest.mock('../braintreeDropin', () => 'BraintreeDropin');

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

const mockCancel = jest.fn();
const mockSubmit = jest.fn();
const defaultProps = {
    onCancel: mockCancel,
    onSubmit: mockSubmit
};

beforeEach(() => {
    mockCancel.mockReset();
    mockSubmit.mockReset();

    // informed's random ids make snapshots unstable
    jest.spyOn(Math, 'random').mockReturnValue(0);
});

test('renders a PaymentsForm component', () => {
    const component = createTestInstance(<PaymentsForm {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('sets addresses_same true if no initial form values', () => {
    const props = {
        ...defaultProps,
        initialValues: {}
    };
    const component = createTestInstance(<PaymentsForm {...props} />);

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
    const component = createTestInstance(<PaymentsForm {...props} />);

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
    const component = createTestInstance(<PaymentsForm {...props} />);

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
    const component = createTestInstance(<PaymentsForm {...props} />);
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
    const component = createTestInstance(<PaymentsForm {...props} />);

    const testNonce = 'testData';
    const dropin = component.root.findByType(BraintreeDropin);
    act(() => {
        dropin.props.onSuccess(testNonce);
    });

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
    const component = createTestInstance(<PaymentsForm {...props} />);

    const testNonce = 'testData';
    const dropin = component.root.findByType(BraintreeDropin);
    act(() => {
        dropin.props.onSuccess(testNonce);
    });
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
    const component = createTestInstance(<PaymentsForm {...defaultProps} />);
    const button = component.root.findAllByType(Button)[1];
    button.props.onClick();

    expect(mockCancel).toHaveBeenCalled();
});

test('submit instance function sets shouldRequestPaymentNonce true in state', async () => {
    const component = createTestInstance(<PaymentsForm {...defaultProps} />);

    const form = component.root.findByType(Form);
    act(() => {
        form.props.onSubmit();
    });

    expect(
        component.root.findByType(BraintreeDropin).props
            .shouldRequestPaymentNonce
    ).toEqual(true);
});

test('cancelPaymentNonceRequest instance function sets shouldRequestPaymentNonce false in state', () => {
    const component = createTestInstance(<PaymentsForm {...defaultProps} />);

    const dropin = component.root.findByType(BraintreeDropin);
    dropin.props.onError();

    expect(
        component.root.findByType(BraintreeDropin).props
            .shouldRequestPaymentNonce
    ).toEqual(false);
});
