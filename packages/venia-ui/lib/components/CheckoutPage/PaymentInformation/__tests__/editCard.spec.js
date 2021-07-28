import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import EditCard from '../editCard';

jest.mock('../../../../classify');
jest.mock('../creditCard', () => props => <mock-CreditCard {...props} />);

test('test renders correctly', () => {
    const tree = createTestInstance(
        <EditCard
            onPaymentReady={jest.fn()}
            onPaymentSuccess={jest.fn()}
            onPaymentError={jest.fn()}
            resetShouldSubmit={jest.fn()}
            shouldSubmit={false}
        />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
