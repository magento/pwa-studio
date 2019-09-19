import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import Button from '../../Button';
import LoadingIndicator from '../../LoadingIndicator';
import SignIn from '../signIn';
import { useUserContext } from '@magento/peregrine/lib/context/user';

jest.mock('../../../classify');
jest.mock('../../Button', () => () => <i />);
jest.mock('../../LoadingIndicator', () => () => <i />);

jest.mock('@magento/peregrine/lib/context/user', () => {
    const userState = {
        isGettingDetails: false,
        isSigningIn: false,
        signInError: null,
        getDetailsError: null
    };
    const userApi = { signIn: jest.fn() };
    const useUserContext = jest.fn(() => [userState, userApi]);

    return { useUserContext };
});

const props = {
    setDefaultUsername: jest.fn(),
    showCreateAccount: jest.fn(),
    showForgotPassword: jest.fn(),
    signIn: jest.fn(),
    hasError: false,
    isSigningIn: false
};

test('renders correctly', () => {
    const component = createTestInstance(<SignIn {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders the loading indicator when form is submitting', () => {
    const [userState, userApi] = useUserContext();
    useUserContext.mockReturnValueOnce([
        { ...userState, isSigningIn: true },
        userApi
    ]);

    const testProps = {
        ...props
    };
    const { root } = createTestInstance(<SignIn {...testProps} />);

    act(() => {
        expect(root.findByType(LoadingIndicator)).toBeTruthy();
    });
});

test('displays an error message if there is a sign in error', () => {
    const [userState, userApi] = useUserContext();
    useUserContext.mockReturnValueOnce([
        { ...userState, signInError: new Error() },
        userApi
    ]);
    const testProps = {
        ...props
    };

    const component = createTestInstance(<SignIn {...testProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls `signIn` on submit', () => {
    const [, { signIn }] = useUserContext();

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
