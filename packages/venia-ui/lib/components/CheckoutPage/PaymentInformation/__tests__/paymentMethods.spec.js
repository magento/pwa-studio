import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import PaymentMethods from '../paymentMethods';
import CreditCard from '../creditCard';

jest.mock('../../../../classify');

jest.mock('../creditCard', () => () => (
    <div>Credit Card Payment Method Component</div>
));

test('Should return correct shape', () => {
    const tree = createTestInstance(
        <PaymentMethods selectedPaymentMethod="braintree" />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render creditCard component with isHidden prop set to false if selectedPaymentMethod is braintree', () => {
    const tree = createTestInstance(
        <PaymentMethods selectedPaymentMethod="braintree" />
    );

    expect(tree.root.findByType(CreditCard).props.isHidden).toBeFalsy();
});
