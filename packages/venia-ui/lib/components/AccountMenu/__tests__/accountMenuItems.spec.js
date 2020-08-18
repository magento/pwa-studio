import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAccountMenuItems } from '@magento/peregrine/lib/talons/AccountMenu/useAccountMenuItems';

import AccountMenuItems from '../accountMenuItems';
import { IntlProvider } from 'react-intl';

jest.mock('@magento/venia-drivers', () => {
    const drivers = jest.requireActual('@magento/venia-drivers');

    return {
        ...drivers,
        Link: children => `<Link>${children.children}</Link>`
    };
});
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
    handleSignOut: jest.fn().mockName('handleSignOut')
};

test('it renders correctly', () => {
    // Arrange.
    useAccountMenuItems.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(
        <IntlProvider locale="en-US">
            <AccountMenuItems {...props} />
        </IntlProvider>
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
