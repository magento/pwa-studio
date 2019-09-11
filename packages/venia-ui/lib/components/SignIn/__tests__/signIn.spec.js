import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import Button from '../../Button';
import LoadingIndicator from '../../LoadingIndicator';
import SignIn from '../signIn';

jest.mock('../../../classify');
jest.mock('../../Button', () => () => <i />);
jest.mock('../../LoadingIndicator', () => () => <i />);

const props = {
    isGettingDetails: false,
    isSigningIn: false,
    setDefaultUsername: jest.fn(),
    showCreateAccount: jest.fn(),
    showForgotPassword: jest.fn(),
    signIn: jest.fn(),
    signInError: {}
};

test('renders correctly', () => {
    const component = createTestInstance(<SignIn {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders the loading indicator if fetching details', () => {
    const testProps = {
        ...props,
        isGettingDetails: true
    };

    const { root } = createTestInstance(<SignIn {...testProps} />);

    expect(root.findByType(LoadingIndicator)).toBeTruthy();
});

test('renders the loading indicator if signing in', () => {
    const testProps = {
        ...props,
        isSigningIn: true
    };

    const { root } = createTestInstance(<SignIn {...testProps} />);

    expect(root.findByType(LoadingIndicator)).toBeTruthy();
});

test('displays an error message if there is a sign in error', () => {
    const testProps = {
        ...props,
        signInError: { message: 'foo ' }
    };

    const component = createTestInstance(<SignIn {...testProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls `signIn` on submit', () => {
    const { signIn } = props;
    const values = { email: 'a', password: 'b' };

    const { root } = createTestInstance(<SignIn {...props} />);

    act(() => {
        root.findByType(Form).props.onSubmit(values);
    });

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenNthCalledWith(1, {
        username: values.email,
        password: values.password
    });
});

test('changes view to CreateAccount', () => {
    const { setDefaultUsername, showCreateAccount } = props;
    const { root } = createTestInstance(<SignIn {...props} />);

    const { onClick } = root
        .findByProps({ className: 'createAccountButton' })
        .findByType(Button).props;

    act(() => {
        onClick();
    });

    expect(setDefaultUsername).toHaveBeenCalledTimes(1);
    expect(showCreateAccount).toHaveBeenCalledTimes(1);
});

test('changes view to ForgotPassword', () => {
    const { setDefaultUsername, showForgotPassword } = props;
    const { root } = createTestInstance(<SignIn {...props} />);

    const { onClick } = root
        .findByProps({ className: 'forgotPasswordButton' })
        .findByType(Button).props;

    act(() => {
        onClick();
    });

    expect(setDefaultUsername).toHaveBeenCalledTimes(1);
    expect(showForgotPassword).toHaveBeenCalledTimes(1);
});

test("avoids reading the form if it doesn't exist", () => {
    const { setDefaultUsername, showCreateAccount, showForgotPassword } = props;
    const instance = createTestInstance(<SignIn {...props} />);
    const { root } = instance;

    const { onClick: createAccount } = root
        .findByProps({ className: 'createAccountButton' })
        .findByType(Button).props;
    const { onClick: forgotPassword } = root
        .findByProps({ className: 'forgotPasswordButton' })
        .findByType(Button).props;

    instance.unmount();

    act(() => {
        createAccount();
    });

    act(() => {
        forgotPassword();
    });

    expect(setDefaultUsername).not.toHaveBeenCalled();
    expect(showCreateAccount).toHaveBeenCalledTimes(1);
    expect(showForgotPassword).toHaveBeenCalledTimes(1);
});
