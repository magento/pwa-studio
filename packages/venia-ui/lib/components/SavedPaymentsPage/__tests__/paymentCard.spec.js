import React from 'react';
import PaymentCard from '../paymentCard';

import { createTestInstance } from '@magento/peregrine';

jest.mock('../savedPaymentTypes', () => ({
    braintree: props => <mock-CreditCard {...props} />
}));

const props = {
    payment_method_code: 'braintree',
    details: {
        maskedCC: '1234',
        type: 'VI',
        expirationDate: '12/12/2022'
    }
};

test('Should render properly', () => {
    const instance = createTestInstance(<PaymentCard {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});
