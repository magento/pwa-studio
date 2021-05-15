import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';

import Summary from '../summary';

jest.mock('../../../../classify');

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary',
    () => {
        return {
            useSummary: jest.fn().mockReturnValue({
                billingAddress: {},
                isBillingAddressSame: false,
                isLoading: false,
                paymentNonce: {},
                selectedPaymentMethod: 'braintree'
            })
        };
    }
);

jest.mock('../summaryPaymentCollection', () => ({
    braintree: props => <mock-Braintree id={'BraintreeMockId'} {...props} />
}));

const billingAddress = {
    firstName: 'Goosey',
    lastName: 'Goose',
    country: 'Goose Land',
    street1: '12345 Goosey Blvd',
    street2: 'Apt 123',
    city: 'Austin',
    state: 'Texas',
    postalCode: '12345',
    phoneNumber: '1234657890'
};

const mockOnEdit = jest.fn();

test('should render a loading indicator', () => {
    useSummary.mockReturnValueOnce({
        isLoading: true
    });

    const tree = createTestInstance(<Summary onEdit={mockOnEdit} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render a non-braintree summary', () => {
    useSummary.mockReturnValueOnce({
        selectedPaymentMethod: { code: 'free', title: 'Free!' }
    });

    const tree = createTestInstance(<Summary onEdit={jest.fn()} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render a braintree summary', () => {
    useSummary.mockReturnValueOnce({
        isBillingAddressSame: false,
        billingAddress,
        paymentNonce: {
            details: { cardType: 'visa', lastFour: '1234' }
        },
        selectedPaymentMethod: {
            code: 'braintree'
        }
    });

    const tree = createTestInstance(<Summary onEdit={jest.fn()} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
