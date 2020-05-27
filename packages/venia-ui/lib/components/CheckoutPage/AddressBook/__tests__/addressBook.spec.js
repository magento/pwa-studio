import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAddressBook } from '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressBook';

import AddressBook from '../addressBook';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressBook'
);
jest.mock('../../../../classify');
jest.mock('../../ShippingInformation/editModal', () => 'EditModal');
jest.mock('../addressCard', () => 'AddressCard');

test('render active state', () => {
    useAddressBook.mockReturnValueOnce({
        activeAddress: 'activeAddress',
        customerAddresses: [
            { id: 1, default_shipping: false, name: 'Philip' },
            { id: 2, default_shipping: true, name: 'Bender' },
            { id: 3, default_shipping: false, name: 'John' }
        ],
        handleAddAddress: jest.fn().mockName('handleAddAddress'),
        handleApplyAddress: jest.fn().mockName('handleApplyAddress'),
        handleEditAddress: jest.fn().mockName('handleEditAddress'),
        handleSelectAddress: jest.fn().mockName('handleSelectAddress'),
        isLoading: false,
        selectedAddress: 3
    });

    const tree = createTestInstance(
        <AddressBook
            activeContent={'addressBook'}
            toggleActiveContent={jest.fn()}
        />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('render hidden state with disabled buttons', () => {
    useAddressBook.mockReturnValueOnce({
        customerAddresses: [],
        handleAddAddress: jest.fn().mockName('handleAddAddress'),
        handleApplyAddress: jest.fn().mockName('handleApplyAddress'),
        isLoading: true
    });

    const tree = createTestInstance(
        <AddressBook
            activeContent={'checkout'}
            toggleActiveContent={jest.fn()}
        />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
