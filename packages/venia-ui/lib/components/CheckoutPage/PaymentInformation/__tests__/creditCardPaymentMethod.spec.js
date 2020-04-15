import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard';

import CreditCardPaymentMethod from '../creditCardPaymentMethod';
import LoadingIndicator from '../../../LoadingIndicator';

import classes from '../creditCardPaymentMethod.css';

jest.mock('../../../../classify');

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard',
    () => {
        return {
            useCreditCard: jest.fn().mockReturnValue({
                onPaymentError: jest.fn(),
                onPaymentSuccess: jest.fn(),
                onPaymentReady: jest.fn(),
                isBillingAddressSame: false,
                countries: {},
                isDropinLoading: false,
                errors: [],
                stepNumber: 0,
                initialValues: {}
            })
        };
    }
);

jest.mock('../brainTreeDropIn', () => {
    return () => <div>Braintree Dropin Component</div>;
});

jest.mock('../../../LoadingIndicator', () => {
    return () => <div>Loading Indicator Component</div>;
});

jest.mock('../../../Checkbox', () => {
    return props => <div {...props}>Checkout Component</div>;
});

jest.mock('../../../Field', () => {
    return props => <div {...props}>Field Component</div>;
});

jest.mock('../../../TextInput', () => {
    return props => <div {...props}>Text Input Component</div>;
});

jest.mock('../../../Country', () => {
    return props => <div {...props}>Country Component</div>;
});

jest.mock('../../../Region', () => {
    return props => <div {...props}>Region Component</div>;
});

const useCreditCardReturnValue = {
    onPaymentError: jest.fn(),
    onPaymentSuccess: jest.fn(),
    onPaymentReady: jest.fn(),
    isBillingAddressSame: false,
    countries: {},
    isDropinLoading: false,
    errors: [],
    stepNumber: 0,
    initialValues: {
        firstName: 'sample first name',
        lastName: 'sample last name',
        city: 'sample city',
        region: 'sample region',
        country: 'sample country',
        street1: 'sample street 1',
        street2: 'sample street 2',
        postalCode: 'sample postal code',
        phoneNumber: 'sample phone number',
        isBillingAddressSame: false
    }
};

test('Should return correct shape', () => {
    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue
    });

    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render loading indicator if isDoprinLoading is set to true', () => {
    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue,
        isDropinLoading: true
    });

    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(tree.root.findByType(LoadingIndicator)).not.toBeNull();
});

test('Should render billing address fields if isBillingAddressSame is false', () => {
    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue,
        isBillingAddressSame: false
    });

    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(
        tree.root.findByProps({ id: 'billingAddressFields' })
    ).not.toBeNull();
});

test('Should not render billing address fields if isBillingAddressSame is true', () => {
    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue,
        isBillingAddressSame: true
    });

    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(() => {
        tree.root.findByProps({ id: 'billingAddressFields' });
    }).toThrow();
});

test('Should render error messages if errors array is not empty', () => {
    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue,
        errors: ['something is missing']
    });

    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(
        tree.root.findByProps({ className: classes.errors_container })
    ).not.toBeNull();
});

test('Should render loading component if stepNumber is between 1 and 6 included', () => {
    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue,
        stepNumber: 1
    });

    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(tree.root.findByType(LoadingIndicator)).not.toBeNull();

    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue,
        stepNumber: 6
    });

    tree.update(<CreditCardPaymentMethod />);

    expect(tree.root.findByType(LoadingIndicator)).not.toBeNull();

    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue,
        stepNumber: 0
    });

    tree.update(<CreditCardPaymentMethod />);

    expect(() => {
        tree.root.findByType(LoadingIndicator);
    }).toThrow();

    useCreditCard.mockReturnValueOnce({
        ...useCreditCardReturnValue,
        stepNumber: 7
    });

    tree.update(<CreditCardPaymentMethod />);

    expect(() => {
        tree.root.findByType(LoadingIndicator);
    }).toThrow();
});
