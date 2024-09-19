import React from 'react';

import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { act } from 'react-test-renderer';

import { useCartContext } from '../../../../../lib/context/cart';
import { useUserContext } from '../../../../../lib/context/user';
import { useAwaitQuery } from '../../../../hooks/useAwaitQuery';
import createTestInstance from '../../../../util/createTestInstance';
import { useCreateAccount } from '../useCreateAccount';
import { useEventingContext } from '../../../../context/eventing';
jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useMutation: jest.fn().mockReturnValue([jest.fn()]),
        useApolloClient: jest.fn(),
        useQuery: jest.fn()
    };
});
jest.mock('../../../../hooks/useAwaitQuery', () => ({
    useAwaitQuery: jest.fn().mockReturnValue(jest.fn())
}));
jest.mock('../../../../../lib/context/user', () => ({
    useUserContext: jest
        .fn()
        .mockReturnValue([
            { isGettingDetails: false },
            { getUserDetails: jest.fn(), setToken: jest.fn() }
        ])
}));
jest.mock('../../../../../lib/context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([
        { cartId: '1234' },
        {
            createCart: jest.fn(),
            removeCart: jest.fn(),
            getCartDetails: jest.fn()
        }
    ])
}));
jest.mock('../../../../store/actions/cart', () => {
    const cartActions = jest.requireActual(
        '../../../store/actions/cart/actions'
    );
    const retrieveCartId = jest.fn().mockReturnValue('12345');

    return Object.assign(cartActions, {
        retrieveCartId
    });
});

jest.mock('../../../../hooks/useGoogleReCaptcha', () => ({
    useGoogleReCaptcha: jest.fn().mockReturnValue({
        recaptchaLoading: false,
        generateReCaptchaData: jest.fn(() => {}),
        recaptchaWidgetProps: {}
    })
}));

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const Component = props => {
    const talonProps = useCreateAccount(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        act(() => {
            tree.update(<Component {...{ ...props, ...newProps }} />);
        });

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

const getCustomerQuery = 'getCustomerQuery';
const getCartDetailsQuery = 'getCartDetailsQuery';
const createAccountMutation = 'createAccountMutation';
const createCartMutation = 'createCartMutation';
const signInMutation = 'signInMutation';
const mergeCartsMutation = 'mergeCartsMutation';
const getStoreConfigQuery = 'getStoreConfigQuery';

const getStoreConfigQueryFn = jest.fn().mockReturnValue({
    data: {
        storeConfig: {
            store_code: 'default',
            minimum_password_length: 8,
            customer_access_token_lifetime: 1
        }
    }
});
const customerQueryFn = jest.fn();
const getCartDetailsQueryFn = jest.fn();
const createAccountMutationFn = jest
    .fn()
    .mockReturnValue([jest.fn(), { error: null }]);
const createCartMutationFn = jest.fn().mockReturnValue([jest.fn()]);
const signInMutationFn = jest.fn().mockReturnValue([
    jest.fn().mockReturnValue({
        data: {
            generateCustomerToken: {
                token: 'customer token'
            }
        }
    }),
    { error: null }
]);
const mergeCartsMutationFn = jest.fn().mockReturnValue([jest.fn()]);
const clearCacheData = jest.fn();
const client = { clearCacheData };

const defaultProps = {
    operations: {
        createAccountMutation,
        createCartMutation,
        getCartDetailsQuery,
        getCustomerQuery,
        mergeCartsMutation,
        getStoreConfigQuery,
        signInMutation
    },
    initialValues: {
        email: 'gooston@goosemail.com',
        firstName: 'Gooseton',
        lastName: 'Jr',
        userName: 'gooseton'
    },
    onSubmit: jest.fn(),
    onCancel: jest.fn()
};

const defaultFormValues = {
    customer: {
        email: 'bender@planet.express',
        firstname: 'Bender',
        lastname: 'Rodriguez'
    },
    password: '123456',
    subscribe: false
};
beforeAll(() => {
    useQuery.mockImplementation(query => {
        if (query === getStoreConfigQuery) {
            return getStoreConfigQueryFn();
        } else {
            return [jest.fn(), {}];
        }
    });
    useAwaitQuery.mockImplementation(query => {
        if (query === getCustomerQuery) {
            return customerQueryFn();
        } else if (query === getCartDetailsQuery) {
            return getCartDetailsQueryFn();
        } else {
            return jest.fn();
        }
    });

    useMutation.mockImplementation(mutation => {
        if (mutation === createAccountMutation) {
            return createAccountMutationFn();
        } else if (mutation === createCartMutation) {
            return createCartMutationFn();
        } else if (mutation === signInMutation) {
            return signInMutationFn();
        } else if (mutation === mergeCartsMutation) {
            return mergeCartsMutationFn();
        } else {
            return [jest.fn()];
        }
    });

    useApolloClient.mockReturnValue(client);
});
test('should return properly', () => {
    const { talonProps } = getTalonProps({
        ...defaultProps
    });

    expect(talonProps).toMatchSnapshot();
});

// test('returns the correct shape with no initial values', async() => {
//     const onSubmit = jest.fn();
//     const { talonProps } = getTalonProps({
//         ...defaultProps,
//         onSubmit: handleSubmit
//     });
//     // await talonProps.handleSubmit()
//     expect(talonProps).toMatchSnapshot();
// });

describe('handle submit event', () => {
    it('should create a new account', async () => {
        const createAccount = jest.fn().mockResolvedValueOnce(true);
        createAccountMutationFn.mockReturnValueOnce([
            createAccount,
            { error: null }
        ]);
        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(createAccount).toHaveBeenCalledWith({
            variables: {
                email: defaultFormValues.customer.email,
                firstname: defaultFormValues.customer.firstname,
                lastname: defaultFormValues.customer.lastname,
                password: defaultFormValues.password,
                is_subscribed: !!defaultFormValues.subscribe
            }
        });
    });
    it('should dispatch create account event', async () => {
        const mockDispatch = jest.fn();

        useEventingContext.mockReturnValueOnce([
            {},
            {
                dispatch: mockDispatch
            }
        ]);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
    });
    test('should signin after account creation', async () => {
        const token = 'customertoken';
        const customer_token_lifetime = 1;
        const signIn = jest.fn().mockReturnValue({
            data: {
                generateCustomerToken: {
                    token
                }
            }
        });
        signInMutationFn.mockReturnValueOnce([signIn, { error: null }]);
        const setToken = jest.fn();
        useUserContext.mockReturnValueOnce([
            { isGettingDetails: false },
            { getUserDetails: jest.fn(), setToken }
        ]);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(signIn).toHaveBeenCalledWith({
            variables: {
                email: defaultFormValues.customer.email,
                password: defaultFormValues.password
            }
        });
        expect(setToken).toHaveBeenCalledWith(token, customer_token_lifetime);
    });

    it('should create a new cart', async () => {
        const createCart = jest.fn();
        useCartContext.mockReturnValueOnce([
            { cartId: '1234' },
            {
                createCart,
                removeCart: jest.fn(),
                getCartDetails: jest.fn()
            }
        ]);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(createCart).toHaveBeenCalled();
    });

    it('should remove cart', async () => {
        const removeCart = jest.fn();
        useCartContext.mockReturnValueOnce([
            { cartId: '1234' },
            {
                createCart: jest.fn(),
                removeCart,
                getCartDetails: jest.fn()
            }
        ]);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(removeCart).toHaveBeenCalled();
    });

    it('should call onSubmit', async () => {
        const onSubmit = jest.fn();

        const { talonProps } = getTalonProps({
            ...defaultProps,
            onSubmit
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(onSubmit).toHaveBeenCalled();
    });

    it('resets the submitting state on error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');
        const mockGetUserDetails = jest.fn();
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
        const { talonProps, update } = getTalonProps({
            ...defaultProps
        });
        const { isDisabled } = update;
        await talonProps.handleSubmit(defaultFormValues);

        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(isDisabled).toBeFalsy();
    });

    it('does not log errors to console in production when an error happens', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');
        process.env.NODE_ENV = 'production';
        const mockGetUserDetails = jest.fn();
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
        const { talonProps } = getTalonProps(defaultProps);
        await act(async () => {
            await talonProps.handleSubmit();
        });
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});
