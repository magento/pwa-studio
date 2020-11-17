import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import { useAccountMenu } from '@magento/peregrine/lib/talons/Header/useAccountMenu';

import AccountMenu from '../accountMenu';

jest.mock('../../../classify');
jest.mock('../accountMenuItems', () => props => (
    <mock-AccountMenuItems {...props} />
));
jest.mock('../../SignIn/signIn', () => props => <mock-SignIn {...props} />);
jest.mock('../../ForgotPassword', () => props => (
    <mock-ForgotPassword {...props} />
));
jest.mock('../../CreateAccount', () => props => (
    <mock-CreateAccount {...props} />
));

jest.mock('@magento/peregrine/lib/talons/Header/useAccountMenu', () => ({
    useAccountMenu: jest.fn().mockReturnValue({
        view: 'ACCOUNT',
        username: 'gooseton',
        handleSignOut: jest.fn(),
        handleForgotPassword: jest.fn(),
        handleCreateAccount: jest.fn(),
        handleForgotPasswordCancel: jest.fn(),
        updateUsername: jest.fn()
    })
}));

const defaultTalonProps = {
    view: 'ACCOUNT',
    username: 'gooseton',
    handleSignOut: jest.fn(),
    handleForgotPassword: jest.fn(),
    handleCreateAccount: jest.fn(),
    handleForgotPasswordCancel: jest.fn(),
    updateUsername: jest.fn()
};

const defaultProps = {
    accountMenuIsOpen: true,
    classes: {
        modal_active: 'modal_active_class'
    },
    setAccountMenuIsOpen: jest.fn()
};

test('it renders empty aside element when accountMenuIsOpen is false', () => {
    const props = {
        ...defaultProps,
        accountMenuIsOpen: false
    };

    // Act.
    const instance = createTestInstance(<AccountMenu {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders AccountMenuItems when the user is signed in', () => {
    // Act.
    const instance = createTestInstance(<AccountMenu {...defaultProps} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders SignIn component when the view is SIGNIN', () => {
    useAccountMenu.mockReturnValueOnce({
        ...defaultTalonProps,
        view: 'SIGNIN'
    });

    // Act.
    const instance = createTestInstance(<AccountMenu {...defaultProps} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders forgot password component when the view is FORGOT_PASSWORD', () => {
    useAccountMenu.mockReturnValueOnce({
        ...defaultTalonProps,
        view: 'FORGOT_PASSWORD'
    });

    // Act.
    const instance = createTestInstance(<AccountMenu {...defaultProps} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders create account component when the view is CREATE_ACCOUNT', () => {
    useAccountMenu.mockReturnValueOnce({
        ...defaultTalonProps,
        view: 'CREATE_ACCOUNT'
    });

    // Act.
    const instance = createTestInstance(<AccountMenu {...defaultProps} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
