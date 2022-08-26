import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react-hooks';

import { useUserContext } from '../../../../context/user';
import { useCartContext } from '../../../../context/cart';
import { useAwaitQuery } from '../../../../hooks/useAwaitQuery';

import { useCreateAccount } from '../useCreateAccount';
import defaultOperations from '../createAccount.gql';
import { useEventingContext } from '../../../../context/eventing';

const createAccountVariables = {
    email: 'bender@planet.express',
    firstname: 'Bender',
    lastname: 'Rodriguez',
    password: '123456',
    is_subscribed: false
};
const createAccount = jest.fn();
const createAccountMock = {
    request: {
        query: defaultOperations.createAccountMutation,
        variables: createAccountVariables
    },
    result: () => {
        createAccount();

        return {
            data: {
                id: 'user_id'
            }
        };
    }
};

const createCartMock = {
    request: {
        query: defaultOperations.createCartMutation
    },
    result: {
        data: {
            cartId: '1234'
        }
    }
};

const getCartDetailsMock = {
    request: {
        query: defaultOperations.getCartDetailsQuery,
        variables: {
            cartId: '1234'
        }
    },
    result: {
        data: {
            id: '1234'
        }
    }
};

const getCustomerMock = {
    request: {
        query: defaultOperations.getCustomerQuery
    },
    result: {
        data: {
            customer: {
                id: '123'
            }
        }
    }
};

const signInVariables = {
    email: 'bender@planet.express',
    password: '123456'
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

jest.mock('../../../../context/user');
const mockGetUserDetails = jest.fn();
const mockSetToken = jest.fn();
useUserContext.mockImplementation(() => {
    const data = {
        isGettingDetails: false
    };

    const api = {
        getUserDetails: mockGetUserDetails,
        setToken: mockSetToken
    };

    return [data, api];
});

jest.mock('../../../../context/cart');
const mockCreateCart = jest.fn();
const mockGetCartDetails = jest.fn();
const mockRemoveCart = jest.fn();
useCartContext.mockImplementation(() => {
    const data = {};
    const api = {
        createCart: mockCreateCart,
        getCartDetails: mockGetCartDetails,
        removeCart: mockRemoveCart
    };

    return [data, api];
});

jest.mock('../../../../hooks/useAwaitQuery');
useAwaitQuery.mockImplementation(jest.fn());

jest.mock('../../../../hooks/useGoogleReCaptcha', () => ({
    useGoogleReCaptcha: jest.fn().mockReturnValue({
        recaptchaLoading: false,
        generateReCaptchaData: jest.fn(() => {}),
        recaptchaWidgetProps: {}
    })
}));

const handleSubmit = jest.fn();

const initialProps = {
    initialValues: {
        email: 'philipfry@fake.email',
        firstName: 'Philip',
        lastName: 'Fry'
    },
    onSubmit: handleSubmit
};

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [
        createAccountMock,
        signInMock,
        createCartMock,
        getCartDetailsMock,
        getCustomerMock
    ]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    return renderHook(useCreateAccount, { wrapper, ...renderHookOptions });
};

test('returns the correct shape', () => {
    const { result } = renderHookWithProviders();

    expect(result.current).toMatchSnapshot();
});

test('returns the correct shape with no initial values', () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: {
            initialProps: {
                onSubmit: handleSubmit
            }
        }
    });

    expect(result.current).toMatchSnapshot();
});

describe('handle submit event', () => {
    const formValues = {
        customer: {
            email: 'bender@planet.express',
            firstname: 'Bender',
            lastname: 'Rodriguez'
        },
        password: '123456',
        subscribe: false
    };

    it('creates an account, dispatches event, signs in, and generates a new cart', async () => {
        const [, { dispatch }] = useEventingContext();

        const { result } = renderHookWithProviders();

        await act(async () => {
            await result.current.handleSubmit(formValues);
        });

        expect(mockSetToken).toHaveBeenCalledWith('auth-token-123');
        expect(createAccount).toHaveBeenCalled();
        expect(mockRemoveCart).toHaveBeenCalled();
        expect(mockCreateCart).toHaveBeenCalledWith({
            fetchCartId: expect.anything()
        });
        expect(mockGetUserDetails).toHaveBeenCalled();
        expect(mockGetCartDetails).toHaveBeenCalled();

        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(result.current.isDisabled).toBeTruthy();

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch.mock.calls[0][0]).toMatchSnapshot();
    });

    it('does not call the submit callback if it is not defined', async () => {
        const { result } = renderHookWithProviders({
            renderHookOptions: {
                initialProps: {
                    onSubmit: undefined
                }
            }
        });

        await act(async () => {
            await result.current.handleSubmit(formValues);
        });

        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('resets the submitting state on error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');

        useUserContext.mockImplementationOnce(() => {
            return [
                {
                    isGettingDetails: false
                },
                {
                    getUserDetails: mockGetUserDetails,
                    setToken: jest.fn(() => {
                        throw new Error('Error setting token');
                    })
                }
            ];
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await result.current.handleSubmit(formValues);
        });

        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(result.current.isDisabled).toBeFalsy();
    });

    it('does not log errors to console in production when an error happens', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');
        process.env.NODE_ENV = 'production';

        useUserContext.mockImplementationOnce(() => {
            return [
                {
                    isGettingDetails: false
                },
                {
                    getUserDetails: mockGetUserDetails,
                    setToken: jest.fn(() => {
                        throw new Error('Error setting token');
                    })
                }
            ];
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await result.current.handleSubmit(formValues);
        });

        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});
