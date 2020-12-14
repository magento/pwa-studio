import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';

import AddressBookPage from '../addressBookPage';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock('../../Head', () => ({ Title: () => 'Title' }));
jest.mock('../../Icon', () => 'Icon');
jest.mock(
    '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage',
    () => {
        return {
            useAddressBookPage: jest.fn()
        };
    }
);
jest.mock('../addEditDialog', () => 'AddEditDialog');
jest.mock('../addressCard', () => 'AddressCard');

const props = {};
const talonProps = {
    countryDisplayNameMap: new Map([['US', 'United States']]),
    customerAddresses: [],
    formErrors: new Map([]),
    formProps: null,
    handleAddAddress: jest.fn().mockName('handleAddAddress'),
    handleCancelDialog: jest.fn().mockName('handleCancelDialog'),
    handleConfirmDialog: jest.fn().mockName('handleConfirmDialog'),
    handleEditAddress: jest.fn().mockName('handleEditAddress'),
    isDialogBusy: false,
    isDialogEditMode: false,
    isDialogOpen: false,
    isLoading: false
};

it('renders correctly when there are no existing addresses', () => {
    // Arrange.
    useAddressBookPage.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(<AddressBookPage {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders loading indicator', () => {
    useAddressBookPage.mockReturnValueOnce({ ...talonProps, isLoading: true });

    const instance = createTestInstance(<AddressBookPage {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders correctly when there are existing addresses', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        customerAddresses: [
            { id: 'a', country_code: 'US' },
            { id: 'b', country_code: 'US', default_shipping: true },
            { id: 'c', country_code: 'FR' }
        ]
    };
    useAddressBookPage.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(<AddressBookPage {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
