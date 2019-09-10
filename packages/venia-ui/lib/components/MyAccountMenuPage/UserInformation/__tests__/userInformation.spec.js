import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import UserInformation from '../userInformation';

const classes = {
    fullName: 'fullName',
    email: 'email',
    userInformationContainer: 'userInformationContainer',
    iconContainer: 'iconContainer',
    root: 'root'
};

const user = {
    fullname: 'Example User',
    email: 'user@example.com'
};

test('renders correctly', () => {
    const wrapper = createTestInstance(
        <UserInformation user={user} classes={classes} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});
