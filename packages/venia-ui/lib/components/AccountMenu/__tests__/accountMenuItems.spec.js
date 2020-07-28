import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import AccountMenuItems from '../accountMenuItems';

jest.mock('@magento/venia-drivers', () => {
    const drivers = jest.requireActual('@magento/venia-drivers');

    return {
        ...drivers,
        Link: children => `<Link>${children.children}</Link>`
    };
});

const props = {
    handleSignOut: jest.fn().mockName('handleSignOut')
};

test('it renders correctly', () => {
    // Act.
    const instance = createTestInstance(<AccountMenuItems {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
