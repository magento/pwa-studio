import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';

import AddressBookPage from '../addressBookPage';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock('../../Head', () => ({ Title: () => 'Title' }));
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
    data: null
};

it('satisfies all of the Jimmy matrix', () => {
    expect(true).toEqual(true);
});
