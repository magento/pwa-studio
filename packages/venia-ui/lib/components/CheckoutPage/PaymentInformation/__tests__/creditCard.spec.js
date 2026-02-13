import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard';

import CreditCard from '../creditCard';
import LoadingIndicator from '../../../LoadingIndicator';

jest.mock('../../../../classify');

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard',
    () => ({
        useCreditCard: jest.fn()
    })
);

jest.mock('../../../FormError', () => 'FormError');

jest.mock('../brainTreeDropIn', () => {
    return props => <mock-BrainTreeDropin {...props} />;
});

jest.mock('../../../LoadingIndicator', () => {
    return props => <mock-LoadingIndicator {...props} />;
});

jest.mock('../../../GoogleReCaptcha', () => {
    return props => <mock-GoogleReCaptcha {...props} />;
});

jest.mock('../../BillingAddress', () => {
    return props => <mock-BillingAddress {...props} />;
});

const defaultTalonReturn = {
    onPaymentError: jest.fn(),
    onPaymentSuccess: jest.fn(),
    onPaymentReady: jest.fn(),
    onBillingAddressChangedSuccess: jest.fn(),
    onBillingAddressChangedError: jest.fn(),
    shouldRequestPaymentNonce: false,
    shouldTeardownDropin: false,
    resetShouldTeardownDropin: jest.fn(),
    isLoading: false,
    errors: new Map(),
    stepNumber: 0,
    recaptchaWidgetProps: {}
};

const defaultProps = {
    shouldSubmit: false,
    resetShouldSubmit: jest.fn(),
    onPaymentSuccess: jest.fn(),
    onPaymentReady: jest.fn(),
    onPaymentError: jest.fn()
};

beforeEach(() => {
    jest.clearAllMocks();
    useCreditCard.mockReturnValue(defaultTalonReturn);
});

describe('CreditCard component (refactored)', () => {
    test('Should return correct shape', () => {
        const tree = createTestInstance(<CreditCard {...defaultProps} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('Should render loading indicator when isLoading is true', () => {
        useCreditCard.mockReturnValueOnce({
            ...defaultTalonReturn,
            isLoading: true
        });

        const tree = createTestInstance(<CreditCard {...defaultProps} />);

        expect(tree.root.findByType(LoadingIndicator)).not.toBeNull();
    });

    test('Should pass correct props to BrainTreeDropin', () => {
        const tree = createTestInstance(<CreditCard {...defaultProps} />);

        const dropin = tree.root.findByType('mock-BrainTreeDropin');

        expect(dropin.props.onError).toBe(defaultTalonReturn.onPaymentError);
        expect(dropin.props.onSuccess).toBe(
            defaultTalonReturn.onPaymentSuccess
        );
        expect(dropin.props.onReady).toBe(defaultTalonReturn.onPaymentReady);
        expect(dropin.props.shouldRequestPaymentNonce).toBe(
            defaultTalonReturn.shouldRequestPaymentNonce
        );
        expect(dropin.props.shouldTeardownDropin).toBe(
            defaultTalonReturn.shouldTeardownDropin
        );
        expect(dropin.props.resetShouldTeardownDropin).toBe(
            defaultTalonReturn.resetShouldTeardownDropin
        );
    });

    test('Should render BillingAddress and pass correct props', () => {
        const tree = createTestInstance(<CreditCard {...defaultProps} />);

        const billing = tree.root.findByType('mock-BillingAddress');

        expect(billing.props.shouldSubmit).toBe(defaultProps.shouldSubmit);
        expect(billing.props.resetShouldSubmit).toBe(
            defaultProps.resetShouldSubmit
        );
        expect(billing.props.onBillingAddressChangedSuccess).toBe(
            defaultTalonReturn.onBillingAddressChangedSuccess
        );
        expect(billing.props.onBillingAddressChangedError).toBe(
            defaultTalonReturn.onBillingAddressChangedError
        );
    });

    test('Should render FormError with mapped errors', () => {
        const error = new Error('payment error');

        useCreditCard.mockReturnValueOnce({
            ...defaultTalonReturn,
            errors: new Map([['setCreditCardDetailsOnCartMutation', error]])
        });

        const tree = createTestInstance(<CreditCard {...defaultProps} />);

        const formError = tree.root.findByType('FormError');

        expect(formError.props.errors).toEqual([error]);
    });

    test('Should render GoogleReCaptcha with widget props', () => {
        const widgetProps = { siteKey: 'abc' };

        useCreditCard.mockReturnValueOnce({
            ...defaultTalonReturn,
            recaptchaWidgetProps: widgetProps
        });

        const tree = createTestInstance(<CreditCard {...defaultProps} />);

        const recaptcha = tree.root.findByType('mock-GoogleReCaptcha');

        expect(recaptcha.props).toEqual(widgetProps);
    });

    test('Should call useCreditCard with correct props', () => {
        createTestInstance(<CreditCard {...defaultProps} />);

        expect(useCreditCard).toHaveBeenCalledWith({
            onSuccess: defaultProps.onPaymentSuccess,
            onReady: defaultProps.onPaymentReady,
            onError: defaultProps.onPaymentError,
            shouldSubmit: defaultProps.shouldSubmit,
            resetShouldSubmit: defaultProps.resetShouldSubmit
        });
    });
});
