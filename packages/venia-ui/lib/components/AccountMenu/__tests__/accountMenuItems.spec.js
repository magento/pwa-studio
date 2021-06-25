import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAccountMenuItems } from '@magento/peregrine/lib/talons/AccountMenu/useAccountMenuItems';

import AccountMenuItems from '../accountMenuItems';

jest.mock('react-router-dom', () => ({
    Link: children => `<Link>${children.children}</Link>`
}));
jest.mock(
    '@magento/peregrine/lib/talons/AccountMenu/useAccountMenuItems',
    () => {
        return {
            useAccountMenuItems: jest.fn()
        };
    }
);

const props = {
    onSignOut: jest.fn().mockName('onSignOut')
};
const talonProps = {
    handleSignOut: jest.fn().mockName('handleSignOut'),
    menuItems: []
};

test('it renders correctly', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        menuItems: [
            {
                name: 'Order History',
                id: 'accountMenu.orderHistoryLink',
                url: '/order-history'
            },
            {
                name: 'Store Credit & Gift Cards',
                id: 'accountMenu.storeCreditLink',
                url: ''
            },
            {
                name: 'Favorites Lists',
                id: 'accountMenu.favoritesListsLink',
                url: '/wishlist'
            },
            {
                name: 'Address Book',
                id: 'accountMenu.addressBookLink',
                url: ''
            },
            {
                name: 'Saved Payments',
                id: 'accountMenu.savedPaymentsLink',
                url: ''
            },
            {
                name: 'Communications',
                id: 'accountMenu.communicationsLink',
                url: '/communications'
            },
            {
                name: 'Account Information',
                id: 'accountMenu.accountInfoLink',
                url: ''
            }
        ]
    };
    useAccountMenuItems.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(<AccountMenuItems {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
