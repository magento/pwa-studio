import React from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';

import ForgotPasswordForm from '../ForgotPasswordForm';
import ForgotPassword from '../forgotPassword';

let mockHasCompleted = false;

jest.mock(
    '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword',
    () => ({
        useForgotPassword: jest
            .fn()
            .mockImplementation(({ onCancel = jest.fn() }) => ({
                forgotPasswordEmail: 'gooseton@goosemail.com',
                formErrors: [],
                handleCancel: onCancel,
                handleFormSubmit: jest.fn(),
                hasCompleted: mockHasCompleted,
                isResettingPassword: false,
                recaptchaWidgetProps: {}
            }))
    })
);

jest.mock('../../FormError', () => props => <mock-FormError {...props} />);
jest.mock('../ForgotPasswordForm', () => props => (
    <mock-ForgotPasswordForm {...props} />
));
jest.mock('../FormSubmissionSuccessful', () => props => (
    <mock-FormSubmissionSuccessful {...props} />
));

test('should render properly', () => {
    const tree = createTestInstance(<ForgotPassword />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render successful view if hasCompleted is true', () => {
    mockHasCompleted = true;

    const tree = createTestInstance(
        <ForgotPassword
            initialValues={{ email: 'gooseton@goosemail.com' }}
            onCancel={jest.fn()}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should call onCancel prop', () => {
    mockHasCompleted = false;
    const mockOnCancelProp = jest.fn();

    const { root } = createTestInstance(
        <ForgotPassword
            initialValues={{ email: 'gooseton@goosemail.com' }}
            onCancel={mockOnCancelProp}
        />
    );

    act(() => {
        root.findByType(ForgotPasswordForm).props.onCancel();
    });

    expect(mockOnCancelProp).toHaveBeenCalled();
});
