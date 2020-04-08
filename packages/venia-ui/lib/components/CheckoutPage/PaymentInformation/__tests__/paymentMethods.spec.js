import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import PaymentMethods from '../paymentMethods';
import CreditCardPaymentMethod from '../creditCardPaymentMethod';

jest.mock('../../../../classify');

jest.mock('../creditCardPaymentMethod', () => () => (
    <div>Credit Card Payment Method Component</div>
));

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods',
    () => ({
        usePaymentMethods: jest.fn().mockReturnValue({})
    })
);

test('Should return correct shape', () => {
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
});
