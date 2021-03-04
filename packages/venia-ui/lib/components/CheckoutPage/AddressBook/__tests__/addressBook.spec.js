import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAddressBook } from '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressBook';

import AddressBook from '../addressBook';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressBook'
);
jest.mock('../../../../classify');
jest.mock('../../ShippingInformation/editModal', () => () => 'EditModal');
jest.mock('../addressCard', () => 'AddressCard');

const mockAddToast = jest.fn();

jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [{}, { addToast: mockAddToast }]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});

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
        handleCancel: jest.fn().mockName('handleCancel'),
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
        handleCancel: jest.fn().mockName('handleCancel'),
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

test('error pops a toast', () => {
    useAddressBook.mockReturnValueOnce({
        customerAddresses: [],
        errorMessage: 'Error Message',
        handleAddAddress: jest.fn().mockName('handleAddAddress'),
        handleApplyAddress: jest.fn().mockName('handleApplyAddress'),
        handleCancel: jest.fn().mockName('handleCancel'),
        isLoading: true
    });

    createTestInstance(
        <AddressBook
            activeContent={'checkout'}
            toggleActiveContent={jest.fn()}
        />
    );

    const addToastProps = mockAddToast.mock.calls[0][0];

    expect(addToastProps).toMatchSnapshot();
});
