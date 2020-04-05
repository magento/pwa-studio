import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import PaymentMethods from '../paymentMethods';
import CreditCardPaymentMethod from '../creditCardPaymentMethod';
import PaypalPaymentMethod from '../paypalPaymentMethod';

jest.mock('../creditCardPaymentMethod', () => () => (
    <div>Credit Card Payment Method Component</div>
));

jest.mock('../paypalPaymentMethod', () => () => (
    <div>Paypal Payment Method Component</div>
));

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods',
    () => ({
        usePaymentMethods: jest.fn().mockReturnValue({})
    })
);

test('Snapshot test', () => {
    const tree = createTestInstance(
        <PaymentMethods selectedPaymentMethod="creditCard" />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render creditCardPaymentMethod component with isHidden prop set to false if selectedPaymentMethod is creditCard', () => {
    const tree = createTestInstance(
        <PaymentMethods selectedPaymentMethod="creditCard" />
    );

    expect(
        tree.root.findByType(CreditCardPaymentMethod).props.isHidden
    ).toBeFalsy();

    expect(
        tree.root.findByType(PaypalPaymentMethod).props.isHidden
    ).toBeTruthy();
});

test('Should render paypalPaymentMethod component with isHidden prop set to false if selectedPaymentMethod is paypal', () => {
    const tree = createTestInstance(
        <PaymentMethods selectedPaymentMethod="paypal" />
    );

    expect(
        tree.root.findByType(PaypalPaymentMethod).props.isHidden
    ).toBeFalsy();

    expect(
        tree.root.findByType(CreditCardPaymentMethod).props.isHidden
    ).toBeTruthy();
});
