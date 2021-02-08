import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react-hooks';

import { useCartContext } from '../../../context/cart';
import { useUserContext } from '../../../context/user';
import defaultOperations from '../signIn.gql';
import { useSignIn } from '../useSignIn';

jest.mock('../../../Apollo/clearCartDataFromCache');
jest.mock('../../../Apollo/clearCustomerDataFromCache');
jest.mock('../../../hooks/useAwaitQuery');
jest.mock('../../../store/actions/cart', () => ({
    retrieveCartId: jest.fn().mockReturnValue('new-cart-id')
}));

jest.mock('../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([
        { cartId: 'old-cart-id' },
        {
            createCart: jest.fn(),
            removeCart: jest.fn(),
            getCartDetails: jest.fn()
        }
    ])
}));

jest.mock('../../../context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([
        {
            isGettingDetails: false,
            getDetailsError: 'getDetails error from redux'
        },
        { getUserDetails: jest.fn(), setToken: jest.fn() }
    ])
}));

const signInVariables = {
    email: 'fry@planetexpress.com',
    password: 'slurm is the best'
};
const authToken = 'auth-token-123';

const signInMock = {
    request: {
        query: defaultOperations.signInMutation,
        variables: signInVariables
    },
    result: {
        data: { generateCustomerToken: { token: authToken } }
    }
};

const mergeCartsMock = {
    request: {
        query: defaultOperations.mergeCartsMutation,
        variables: {
            destinationCartId: 'new-cart-id',
            sourceCartId: 'old-cart-id'
        }
    },
    result: {
        data: null
    }
};

const initialProps = {
    getCartDetailsQuery: 'getCartDetailsQuery',
    setDefaultUsername: jest.fn(),
    showCreateAccount: jest.fn(),
    showForgotPassword: jest.fn()
};

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [signInMock, mergeCartsMock]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    return renderHook(useSignIn, { wrapper, ...renderHookOptions });
};

test('returns correct shape', () => {
    const { result } = renderHookWithProviders();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "errors": Map {
            "getUserDetailsQuery" => "getDetails error from redux",
            "signInMutation" => undefined,
          },
          "handleCreateAccount": [Function],
          "handleForgotPassword": [Function],
          "handleSubmit": [Function],
          "isBusy": false,
          "setFormApi": [Function],
        }
    `);
});

test('handleSubmit triggers waterfall of operations and actions', async () => {
    const [, { getCartDetails }] = useCartContext();
    const [, { getUserDetails, setToken }] = useUserContext();

    const { result } = renderHookWithProviders();

    await act(() => result.current.handleSubmit(signInVariables));

    expect(result.current.isBusy).toBe(true);
    expect(setToken).toHaveBeenCalledWith(authToken);
    expect(getCartDetails).toHaveBeenCalled();
    expect(getUserDetails).toHaveBeenCalled();
});

test('handleSubmit exception is logged and resets state', async () => {
    const errorMessage = 'Oh no! Something went wrong :(';
    const [, { getUserDetails, setToken }] = useUserContext();
    setToken.mockRejectedValue(errorMessage);
    jest.spyOn(console, 'error');

    const { result } = renderHookWithProviders();

    await act(() => result.current.handleSubmit(signInVariables));

    expect(result.current.isBusy).toBe(false);
    expect(getUserDetails).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(errorMessage);
});

test('handleForgotPassword triggers callbacks', () => {
    const mockUsername = 'fry@planetexpress.com';
    const mockApi = {
        getValue: jest.fn().mockReturnValue(mockUsername)
    };

    const { result } = renderHookWithProviders();
    act(() => result.current.setFormApi(mockApi));
    act(() => result.current.handleForgotPassword());

    expect(initialProps.setDefaultUsername).toHaveBeenCalledWith(mockUsername);
    expect(initialProps.showForgotPassword).toHaveBeenCalled();
});

test('handleCreateAccount triggers callbacks', () => {
    const mockUsername = 'fry@planetexpress.com';
    const mockApi = {
        getValue: jest.fn().mockReturnValue(mockUsername)
    };

    const { result } = renderHookWithProviders();
    act(() => result.current.setFormApi(mockApi));
    act(() => result.current.handleCreateAccount());

    expect(initialProps.setDefaultUsername).toHaveBeenCalledWith(mockUsername);
    expect(initialProps.showCreateAccount).toHaveBeenCalled();
});

test('mutation error is returned by talon', async () => {
    const signInErrorMock = {
        request: signInMock.request,
        error: new Error('Uh oh! There was an error signing in :(')
    };

    const { result } = renderHookWithProviders({ mocks: [signInErrorMock] });
    await act(() => result.current.handleSubmit(signInVariables));

    expect(result.current.errors.get('signInMutation')).toMatchInlineSnapshot(
        `[Error: Uh oh! There was an error signing in :(]`
    );
});
