import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { IntlProvider } from 'react-intl';

import AccountTrigger from '../accountTrigger';

jest.mock('@magento/peregrine/lib/talons/Header/useAccountTrigger', () => {
    return { useAccountTrigger: jest.fn() };
});

jest.mock('../../AccountChip', () => 'Account Chip');
jest.mock('../../AccountMenu', () => 'Account Menu');
jest.mock('@magento/venia-ui/lib/classify');

const talonProps = {
    accountMenuIsOpen: false,
    accountMenuRef: { current: null },
    accountMenuTriggerRef: { current: null },
    handleSignOut: jest.fn().mockName('handleSignOut'),
    handleTriggerClick: jest.fn().mockName('handleTriggerClick'),
    isUserSignedIn: false,
    formErrors: []
};

test('it renders correctly', () => {
    // Arrange.
    useAccountTrigger.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(
        <IntlProvider locale="en-US">
            <AccountTrigger />
        </IntlProvider>
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
