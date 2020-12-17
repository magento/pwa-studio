import React from 'react';
import CreditCard from '../creditCard';

import { createTestInstance } from '@magento/peregrine';

const props = {
    details: {
        maskedCC: '1234',
        type: 'VI',
        expirationDate: '12/12/2022'
    }
};

test('Should render properly', () => {
    const instance = createTestInstance(<CreditCard {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});
