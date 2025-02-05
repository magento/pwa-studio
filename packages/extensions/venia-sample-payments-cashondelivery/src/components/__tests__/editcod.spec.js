import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EditCod from '../editcod';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('../cashondelivery', () => props => (
    <mock-CashOnDelivery {...props} />
));

const mocks = {
    onPaymentReady: jest.fn().mockName('onPaymentReady'),
    onPaymentSuccess: jest.fn().mockName('onPaymentSuccess'),
    onPaymentError: jest.fn().mockName('onPaymentError'),
    resetShouldSubmit: jest.fn().mockName('resetShouldSubmit')
};

test('renders correctly', () => {
    // Arrange.
    const props = {
        ...mocks,
        shouldSubmit: false
    };

    // Act.
    const tree = createTestInstance(<EditCod {...props} />);

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});
