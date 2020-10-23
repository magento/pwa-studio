import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword';

import ForgotPassword from '../forgotPassword';

jest.mock('../FormSubmissionSuccessful', () => props => (
    <mock-FormSubmissionSuccessful {...props} />
));
jest.mock('../ForgotPasswordForm', () => props => (
    <mock-ForgotPasswordForm {...props} />
));

jest.mock(
    '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword',
    () => ({
        useForgotPassword: jest.fn().mockReturnValue({
            forgotPasswordEmail: 'gooseton@goosemail.com',
            formErrors: [],
            handleCancel: jest.fn(),
            handleFormSubmit: jest.fn(),
            hasCompleted: false,
            isResettingPassword: false
        })
    })
);

test('should render properly', () => {
    const tree = createTestInstance(
        <ForgotPassword
            initialValues={{ email: 'gooseton@goosemail.com' }}
            onCancel={jest.fn()}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render successful view if hasCompleted is true', () => {
    useForgotPassword.mockReturnValueOnce({
        forgotPasswordEmail: 'gooseton@goosemail.com',
        formErrors: [],
        handleCancel: jest.fn(),
        handleFormSubmit: jest.fn(),
        hasCompleted: true,
        isResettingPassword: false
    });

    const tree = createTestInstance(
        <ForgotPassword
            initialValues={{ email: 'gooseton@goosemail.com' }}
            onCancel={jest.fn()}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
