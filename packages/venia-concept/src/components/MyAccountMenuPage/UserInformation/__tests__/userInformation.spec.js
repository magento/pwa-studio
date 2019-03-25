import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import UserInformation from '../userInformation';

jest.mock('src/classify');

const user = {
    fullname: 'Example User',
    email: 'user@example.com'
};

test('renders correctly', () => {
    const { root } = createTestInstance(<UserInformation user={user} />);

    expect(root.findByProps({ className: 'email' })).toBeTruthy();
    expect(root.findByProps({ className: 'fullName' })).toBeTruthy();
    expect(root.findByProps({ className: 'icon' })).toBeTruthy();
    expect(root.findByProps({ className: 'root' })).toBeTruthy();
    expect(root.findByProps({ className: 'user' })).toBeTruthy();
});
