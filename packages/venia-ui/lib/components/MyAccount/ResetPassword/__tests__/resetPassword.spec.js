import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import ResetPassword from '../resetPassword';

jest.mock('@magento/peregrine', () => ({
    useToasts: jest.fn().mockReturnValue([{}, { addToast: jest.fn() }])
}));
jest.mock('@magento/peregrine/lib/talons/MyAccount/useResetPassword', () => ({
    useResetPassword: jest.fn().mockReturnValue({
        hasCompleted: false,
        loading: false,
        email: 'gooseton@goosemail.com',
        token: '********',
        formErrors: null,
        handleSubmit: jest.fn()
    })
}));
jest.mock('../../../Head', () => props => <div {...props}>Head Component</div>);

test('should render properly', () => {
    const tree = createTestInstance(<ResetPassword />);

    expect(tree.toJSON()).toMatchSnapshot();
});
