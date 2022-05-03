import React from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { createTestInstance } from '@magento/peregrine';

import AddressForm from '../addressForm';

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn()
}));
jest.mock('../guestForm', () => 'GuestForm');
jest.mock('../customerForm', () => 'CustomerForm');

test('renders guest form', () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: false }]);

    const tree = createTestInstance(
        <AddressForm propA="propA" propB="propB" />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders customer form', () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);

    const tree = createTestInstance(
        <AddressForm propA="propA" propB="propB" />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
