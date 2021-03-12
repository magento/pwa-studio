import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCheckmo } from '../../talons/useCheckmo';

import CheckMo from '../checkmo';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('../../talons/useCheckmo', () => {
    return {
        useCheckmo: jest.fn().mockReturnValue({
            payableTo: '',
            mailingAddress: '',
            onBillingAddressChangedError: jest.fn(),
            onBillingAddressChangedSuccess: jest.fn()
        })
    };
});

jest.mock(
    '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress',
    () => props => <mock-BillingAddress {...props} />
);

const useCheckmoReturnValue = {
    payableTo: '',
    mailingAddress: '',
    onBillingAddressChangedError: jest.fn(),
    onBillingAddressChangedSuccess: jest.fn()
};

test('Should return correct shape', () => {
    useCheckmo.mockReturnValueOnce({
        ...useCheckmoReturnValue
    });

    const tree = createTestInstance(<CheckMo />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render with mailingAddress payable', () => {
    useCheckmo.mockReturnValueOnce({
        ...useCheckmoReturnValue,
        payableTo: 'Test Inc',
        mailingAddress: 'Test Inc\r\nc/o Payment\r\nPO 12\r\nAustin Texas'
    });

    const tree = createTestInstance(<CheckMo />);

    expect(tree.toJSON()).toMatchSnapshot();
});
