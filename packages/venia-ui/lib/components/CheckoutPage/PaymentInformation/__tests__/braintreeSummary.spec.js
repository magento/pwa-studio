import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
jest.mock('../../../../classify');

import classes from '../braintreeSummary.module.css';
import { useBraintreeSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useBraintreeSummary';
import BraintreeSummary from '../braintreeSummary';

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

const paymentNonce = {
    details: { cardType: 'visa', lastFour: '1234' }
};

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useBraintreeSummary',
    () => {
        return {
            useBraintreeSummary: jest.fn(() => ({
                billingAddress: {
                    firstName: 'Goosey',
                    lastName: 'Goose',
                    country: 'Goose Land',
                    street1: '12345 Goosey Blvd',
                    street2: 'Apt 123',
                    city: 'Austin',
                    state: 'Texas',
                    postalCode: '12345',
                    phoneNumber: '1234657890'
                },
                isBillingAddressSame: true,
                isLoading: false,
                paymentNonce: {
                    details: { cardType: 'visa', lastFour: '1234' }
                }
            }))
        };
    }
);

test('should render', () => {
    useBraintreeSummary.mockReturnValueOnce({
        billingAddress,
        isBillingAddressSame: true,
        isLoading: false,
        paymentNonce
    });
    const tree = createTestInstance(<BraintreeSummary />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render billing address if it is not same as shipping address', () => {
    useBraintreeSummary.mockReturnValueOnce({
        billingAddress,
        isBillingAddressSame: false,
        isLoading: false,
        paymentNonce
    });
    const tree = createTestInstance(<BraintreeSummary />);

    expect(tree.toJSON()).toMatchSnapshot();

    expect(
        tree.root.findByProps({
            className: classes.address_summary_container
        })
    ).not.toBeNull();
});

test('Should not render billing address if it is same as shipping address', () => {
    useBraintreeSummary.mockReturnValueOnce({
        billingAddress: {},
        isBillingAddressSame: false,
        isLoading: false,
        paymentNonce
    });
    const tree = createTestInstance(<BraintreeSummary />);

    expect(tree.toJSON()).toMatchSnapshot();
    expect(
        tree.root.findByProps({
            className: classes.address_summary_container
        })
    ).not.toBeNull();
});
