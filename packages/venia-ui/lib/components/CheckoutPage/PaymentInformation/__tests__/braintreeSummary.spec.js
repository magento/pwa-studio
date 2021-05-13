import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
jest.mock('../../../../classify');

import classes from '../braintreeSummary.css';
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

test('should render', () => {
    const tree = createTestInstance(
        <BraintreeSummary
            billingAddress={billingAddress}
            paymentNonce={paymentNonce}
            isBillingAddressSame={false}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render billing address if it is not same as shipping address', () => {
    const tree = createTestInstance(
        <BraintreeSummary
            billingAddress={billingAddress}
            paymentNonce={paymentNonce}
            isBillingAddressSame={false}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();

    expect(
        tree.root.findByProps({
            className: classes.address_summary_container
        })
    ).not.toBeNull();
});

test('Should not render billing address if it is same as shipping address', () => {
    const tree = createTestInstance(
        <BraintreeSummary
            billingAddress={{}}
            paymentNonce={paymentNonce}
            isBillingAddressSame={false}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
    expect(
        tree.root.findByProps({
            className: classes.address_summary_container
        })
    ).not.toBeNull();
});
