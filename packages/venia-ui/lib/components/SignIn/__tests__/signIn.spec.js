import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import Button from '../../Button';
import LoadingIndicator from '../../LoadingIndicator';
import SignIn from '../signIn';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useMutation } from '@apollo/client';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useApolloClient: jest.fn().mockImplementation(() => {}),
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));
jest.mock('../../../classify');
jest.mock('../../Button', () => () => <i />);
jest.mock('../../FormError/formError', () => 'FormError');
jest.mock('../../LoadingIndicator', () => () => <i />);

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {};
    const api = {
        createCart: jest.fn(),
        getCartDetails: jest.fn(),
        removeCart: jest.fn()
    };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const userState = {
        isGettingDetails: false,
        getDetailsError: null
    };
    const userApi = {
        getUserDetails: jest.fn(),
        setToken: jest.fn(),
        signIn: jest.fn()
    };
    const useUserContext = jest.fn(() => [userState, userApi]);

    return { useUserContext };
});

jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest
        .fn()
        .mockResolvedValue({ data: { customer: {} } });

    return { useAwaitQuery };
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
        { ...userState, isGettingDetails: true },
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

// TODO: Move this to useSignIn.spec.js and test handleSignIn
test.skip('calls `signIn` on submit', () => {
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
        .findByProps({ className: 'buttonsContainer' })
        .findByProps({ type: 'button' }).props;

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
        .findByProps({ className: 'forgotPasswordButtonContainer' })
        .findByType(Button).props;

    act(() => {
        onClick();
    });

    expect(setDefaultUsername).toHaveBeenCalledTimes(1);
    expect(showForgotPassword).toHaveBeenCalledTimes(1);
});
