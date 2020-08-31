import React from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';

import { useAwaitQuery } from '../../../../lib/hooks/useAwaitQuery';
import { useUserContext } from '../../../../lib/context/user';
import { useCreateAccount } from '../useCreateAccount';
import { clearCartDataFromCache } from '../../../Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '../../../Apollo/clearCustomerDataFromCache';
import { retrieveCartId } from '../../../store/actions/cart';
import { useCartContext } from '../../../context/cart';

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockReturnValue([jest.fn()]),
    useApolloClient: jest.fn()
}));
jest.mock('../../../../lib/hooks/useAwaitQuery', () => ({
    useAwaitQuery: jest.fn().mockReturnValue(jest.fn())
}));
jest.mock('../../../../lib/context/user', () => ({
    useUserContext: jest
        .fn()
        .mockReturnValue([
            { isGettingDetails: false, isSignedIn: false },
            { getUserDetails: jest.fn(), setToken: jest.fn() }
        ])
}));
jest.mock('../../../../lib/context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([
        { cartId: '1234' },
        {
            createCart: jest.fn(),
            removeCart: jest.fn(),
            getCartDetails: jest.fn()
        }
    ])
}));
jest.mock('../../../Apollo/clearCartDataFromCache', () => ({
    clearCartDataFromCache: jest.fn().mockResolvedValue(true)
}));
jest.mock('../../../Apollo/clearCustomerDataFromCache', () => ({
    clearCustomerDataFromCache: jest.fn().mockResolvedValue(true)
}));
jest.mock('../../../store/actions/cart', () => {
    const cartActions = jest.requireActual(
        '../../../store/actions/cart/actions'
    );
    const retrieveCartId = jest.fn().mockReturnValue('12345');

    return Object.assign(cartActions, {
        retrieveCartId
    });
});

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

const customerQuery = 'customerQuery';
const getCartDetailsQuery = 'getCartDetailsQuery';
const createAccountMutation = 'createAccountMutation';
const createCartMutation = 'createCartMutation';
const signInMutation = 'signInMutation';
const mergeCartsMutation = 'mergeCartsMutation';

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

const defaultProps = {
    queries: {
        customerQuery,
        getCartDetailsQuery
    },
    mutations: {
        createAccountMutation,
        createCartMutation,
        signInMutation,
        mergeCartsMutation
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
        email: 'gooston@goosemail.com',
        firstname: 'Gooseton',
        lastname: 'Jr'
    },
    password: 'Gooseton123?',
    subscribe: false
};

beforeAll(() => {
    useAwaitQuery.mockImplementation(query => {
        if (query === customerQuery) {
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
});

test('should return properly', () => {
    const { talonProps } = getTalonProps({
        ...defaultProps
    });

    expect(talonProps).toMatchSnapshot();
});

test('handleCancel should call onCancel', () => {
    const onCancel = jest.fn();
    const { talonProps } = getTalonProps({
        ...defaultProps,
        onCancel
    });

    talonProps.handleCancel();

    expect(onCancel).toHaveBeenCalled();
});

test('errros should render properly', () => {
    createAccountMutationFn.mockReturnValueOnce([
        jest.fn(),
        { error: 'Create Account Mutation Error' }
    ]);
    signInMutationFn.mockReturnValueOnce([
        jest.fn(),
        { error: 'Sign In Mutation Error' }
    ]);

    const { talonProps } = getTalonProps({
        ...defaultProps
    });

    expect(talonProps.errors).toMatchSnapshot();
});

test('isDisabled should be true if isGettingDetails is true', () => {
    useUserContext.mockReturnValueOnce([
        { isGettingDetails: true, isSignedIn: false },
        { getUserDetails: jest.fn(), setToken: jest.fn() }
    ]);

    const { talonProps } = getTalonProps({
        ...defaultProps
    });

    expect(talonProps.isDisabled).toBeTruthy();
});

describe('handleSubmit', () => {
    test('should set isDisabled to true', () => {
        const { talonProps, update } = getTalonProps({
            ...defaultProps
        });
        talonProps.handleSubmit(defaultFormValues);

        const { isDisabled } = update();

        expect(isDisabled).toBeTruthy();
    });

    test('should set isDisabled to false if the function fails', async () => {
        createAccountMutationFn.mockReturnValueOnce([
            jest.fn().mockRejectedValueOnce(false),
            { error: 'Create account error' }
        ]);
        const { talonProps, update } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        const { isDisabled } = update();

        expect(isDisabled).toBeFalsy();
    });

    test('should create a new account', async () => {
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

    test('should signin after account creation', async () => {
        const token = 'customertoken';
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
            { isGettingDetails: false, isSignedIn: false },
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
        expect(setToken).toHaveBeenCalledWith(token);
    });

    test('should clear cart data from cache', async () => {
        const apolloClient = {};
        useApolloClient.mockReturnValueOnce(apolloClient);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(clearCartDataFromCache).toHaveBeenCalledWith(apolloClient);
    });

    test('should clear customer data from cache', async () => {
        const apolloClient = {};
        useApolloClient.mockReturnValueOnce(apolloClient);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(clearCustomerDataFromCache).toHaveBeenCalledWith(apolloClient);
    });

    test('should remove cart', async () => {
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

    test('should create a new cart', async () => {
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

    test('should merge carts', async () => {
        const mergeCarts = jest.fn();
        mergeCartsMutationFn.mockReturnValueOnce([mergeCarts]);
        retrieveCartId.mockReturnValueOnce('12345');
        useCartContext.mockReturnValueOnce([
            { cartId: '1234' },
            {
                createCart: jest.fn(),
                removeCart: jest.fn(),
                getCartDetails: jest.fn()
            }
        ]);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(retrieveCartId).toHaveBeenCalled();
        expect(mergeCarts).toHaveBeenCalledWith({
            variables: {
                destinationCartId: '12345',
                sourceCartId: '1234'
            }
        });
    });

    test('should get user details', async () => {
        const fetchUserDetails = jest.fn();
        customerQueryFn.mockReturnValueOnce(fetchUserDetails);
        const getUserDetails = jest.fn();
        useUserContext.mockReturnValueOnce([
            { isGettingDetails: false, isSignedIn: false },
            { getUserDetails, setToken: jest.fn() }
        ]);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(getUserDetails).toHaveBeenCalledWith({ fetchUserDetails });
    });

    test('should get cart details', async () => {
        const fetchCartDetails = jest.fn();
        getCartDetailsQueryFn.mockReturnValueOnce(fetchCartDetails);
        const getCartDetails = jest.fn();
        useCartContext.mockReturnValueOnce([
            { cartId: '1234' },
            {
                createCart: jest.fn(),
                removeCart: jest.fn(),
                getCartDetails
            }
        ]);
        const fetchCartId = jest.fn();
        createCartMutationFn.mockReturnValueOnce([fetchCartId]);

        const { talonProps } = getTalonProps({
            ...defaultProps
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(getCartDetails).toHaveBeenCalledWith({
            fetchCartDetails,
            fetchCartId
        });
    });

    test('should call onSubmit', async () => {
        const onSubmit = jest.fn();

        const { talonProps } = getTalonProps({
            ...defaultProps,
            onSubmit
        });

        await talonProps.handleSubmit(defaultFormValues);

        expect(onSubmit).toHaveBeenCalled();
    });
});
