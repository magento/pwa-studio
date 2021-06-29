import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Edit from '../edit';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('../checkmo', () => props => <mock-CheckMo {...props} />);

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
    const tree = createTestInstance(<Edit {...props} />);

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});
