import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';

import AddressBookPage from '../addressBookPage';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock('../../Head', () => ({ Title: () => 'Title' }));
jest.mock('../../CheckoutPage/AddressBook/addressCard', () => 'AddressCard');
jest.mock('../../Icon', () => 'Icon');
jest.mock(
    '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage',
    () => {
        return {
            useAddressBookPage: jest.fn()
        };
    }
);

const props = {};
const talonProps = {
    customerAddresses: [],
    handleAddAddress: jest.fn().mockName('handleAddAddress')
};

it('renders correctly when there are no existing addresses', () => {
    // Arrange.
    useAddressBookPage.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(<AddressBookPage {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders correctly when there are existing addresses', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        customerAddresses: ['a', 'b', 'c']
    };
    useAddressBookPage.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(<AddressBookPage {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
