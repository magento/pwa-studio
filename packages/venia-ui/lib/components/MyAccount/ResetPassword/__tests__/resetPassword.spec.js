import React from 'react';

import { useToasts } from '@magento/peregrine';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword';

import ResetPassword from '../resetPassword';

jest.mock('@magento/peregrine', () => ({
    useToasts: jest.fn().mockReturnValue([{}, { addToast: jest.fn() }])
}));
jest.mock('@magento/peregrine/lib/talons/MyAccount/useResetPassword', () => ({
    useResetPassword: jest.fn().mockReturnValue({
        hasCompleted: false,
        loading: false,
        token: '********',
        formErrors: [],
        handleSubmit: jest.fn().mockName('handleSubmit'),
        recaptchaWidgetProps: {}
    })
}));

jest.mock('../../../Head', () => ({
    StoreTitle: props => <mock-StoreTitle {...props} />
}));

test('should render properly', () => {
    const tree = createTestInstance(<ResetPassword />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render error message if token is falsy', () => {
    useResetPassword.mockReturnValueOnce({
        hasCompleted: false,
        loading: false,
        token: null,
        formErrors: [],
        handleSubmit: jest.fn(),
        recaptchaWidgetProps: {}
    });

    const tree = createTestInstance(<ResetPassword />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render formErrors', () => {
    useResetPassword.mockReturnValueOnce({
        hasCompleted: false,
        loading: false,
        token: '**********',
        formErrors: [
            {
                graphQLErrors: {
                    message: 'This is an error.'
                }
            }
        ],
        handleSubmit: jest.fn(),
        recaptchaWidgetProps: {}
    });

    const tree = createTestInstance(<ResetPassword />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render success message if hasCompleted is true', () => {
    useResetPassword.mockReturnValueOnce({
        hasCompleted: true,
        loading: false,
        token: '**********',
        formErrors: [],
        handleSubmit: jest.fn(),
        recaptchaWidgetProps: {}
    });

    const tree = createTestInstance(<ResetPassword />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render toast if hasCompleted is true', () => {
    const addToast = jest.fn();
    useToasts.mockReturnValueOnce([{}, { addToast }]);
    useResetPassword.mockReturnValueOnce({
        hasCompleted: true,
        loading: false,
        token: '**********',
        formErrors: [],
        handleSubmit: jest.fn(),
        recaptchaWidgetProps: {}
    });

    createTestInstance(<ResetPassword />);

    expect(addToast).toHaveBeenCalledWith({
        type: 'info',
        message: 'Your new password has been saved.',
        timeout: 5000
    });
});
