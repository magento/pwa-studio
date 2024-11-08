import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCashondelivery } from '../../talons/useCashondelivery';

import CashOnDelivery from '../cashondelivery';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('../../talons/useCashondelivery', () => {
    return {
        useCashondelivery: jest.fn().mockReturnValue({
            onBillingAddressChangedError: jest.fn(),
            onBillingAddressChangedSuccess: jest.fn()
        })
    };
});

jest.mock(
    '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress',
    () => props => <mock-BillingAddress {...props} />
);

const useCashondeliveryReturnValue = {
    onBillingAddressChangedError: jest.fn(),
    onBillingAddressChangedSuccess: jest.fn()
};

test('Should render CashOnDelivery component correctly', () => {
    useCashondelivery.mockReturnValueOnce({
        ...useCashondeliveryReturnValue
    });

    const tree = createTestInstance(<CashOnDelivery />);

    expect(tree.toJSON()).toMatchSnapshot();
});
