import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import AccountMenu from '../accountMenu';

jest.mock('../accountMenuItems', () => 'AccountMenuItems');

const props = {
    handleSignOut: jest.fn().mockName('handleSignOut'),
    isOpen: true,
    isUserSignedIn: true
};

test('it renders AccountMenuItems when the user is signed in', () => {
    // Act.
    const instance = createTestInstance(<AccountMenu {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
