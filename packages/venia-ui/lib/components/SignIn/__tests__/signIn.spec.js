import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import Button from '../../Button';
import LoadingIndicator from '../../LoadingIndicator';
import SignIn from '../signIn';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ]),
    useLazyQuery: jest.fn(() => [
        jest.fn(),
        {
            called: true,
            data: { customer: {} },
            error: null,
            loading: false
        }
    ])
}));

jest.mock('../../../classify');
jest.mock('../../Button', () => () => <i />);
jest.mock('../../LoadingIndicator', () => () => <i />);

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {};
    const api = { getCartDetails: jest.fn(), removeCart: jest.fn() };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const userApi = {
        actions: { getDetails: { receive: jest.fn() } },
        setToken: jest.fn(),
        signIn: jest.fn()
    };
    const useUserContext = jest.fn(() => [{}, userApi]);

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
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            called: true,
            data: { customer: {} },
            error: null,
            loading: true
        }
    ]);
    const { root } = createTestInstance(<SignIn {...props} />);

    act(() => {
        expect(root.findByType(LoadingIndicator)).toBeTruthy();
    });
});

test('displays an error message if there is a sign in error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            error: {
                graphQLErrors: [
                    {
                        message:
                            'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.'
                    }
                ]
            }
        }
    ]);
    const [userState, userApi] = useUserContext();
    useUserContext.mockReturnValueOnce([{ ...userState }, userApi]);
    const testProps = {
        ...props
    };

    const component = createTestInstance(<SignIn {...testProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls `signIn` on submit', () => {
    const signInMock = jest.fn();
    useMutation.mockReturnValueOnce([signInMock, {}]);
    const values = { email: 'a', password: 'b' };

    const { root } = createTestInstance(<SignIn {...props} />);

    act(() => {
        root.findByType(Form).props.onSubmit(values);
    });

    expect(signInMock).toHaveBeenCalledTimes(1);
    expect(signInMock).toHaveBeenNthCalledWith(1, {
        variables: {
            email: values.email,
            password: values.password
        }
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
