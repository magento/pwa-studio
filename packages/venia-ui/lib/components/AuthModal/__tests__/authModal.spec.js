import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import AuthModal from '../authModal';

jest.mock('../../../classify');
jest.mock('../../CreateAccount', () => props => (
    <mock-CreateAccount {...props} />
));
jest.mock('../../ForgotPassword', () => props => (
    <mock-ForgotPassword {...props} />
));
jest.mock('../../MyAccount', () => props => <mock-MyAccount {...props} />);
jest.mock('../../SignIn', () => props => <mock-SignIn {...props} />);

jest.mock('@magento/peregrine/lib/talons/AuthModal/useAuthModal', () => ({
    useAuthModal: jest.fn().mockReturnValue({
        handleCancel: jest.fn(),
        handleCreateAccount: jest.fn(),
        handleSignOut: jest.fn(),
        setUsername: jest.fn(),
        showCreateAccount: jest.fn(),
        showForgotPassword: jest.fn(),
        showMyAccount: jest.fn(),
        username: ''
    })
}));

const defaultProps = {
    closeDrawer: jest.fn(),
    showCreateAccount: jest.fn(),
    showForgotPassword: jest.fn(),
    showMyAccount: jest.fn(),
    showMainMenu: jest.fn(),
    showSignIn: jest.fn(),
    view: 'SIGN_IN'
};

test('should render properly', () => {
    const tree = createTestInstance(<AuthModal {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render forgot password component if view is FORGOT_PASSWORD', () => {
    const tree = createTestInstance(
        <AuthModal {...defaultProps} view={'FORGOT_PASSWORD'} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render create account component if view is CREATE_ACCOUNT', () => {
    const tree = createTestInstance(
        <AuthModal {...defaultProps} view={'CREATE_ACCOUNT'} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render my account component if view is MY_ACCOUNT', () => {
    const tree = createTestInstance(
        <AuthModal {...defaultProps} view={'MY_ACCOUNT'} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
