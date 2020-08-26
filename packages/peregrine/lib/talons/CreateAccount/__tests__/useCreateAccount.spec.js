import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';

import { useAwaitQuery } from '../../../../lib/hooks/useAwaitQuery';
import { useCreateAccount } from '../useCreateAccount';

jest.mock('@apollo/react-hooks', () => ({
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
jest.fn('../../../Apollo/clearCartDataFromCache', () => ({
    clearCartDataFromCache: jest.fn().mockResolvedValue(true)
}));
jest.mock('../../../Apollo/clearCustomerDataFromCache', () => ({
    clearCustomerDataFromCache: jest.fn().mockResolvedValue(true)
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
const signInMutationFn = jest
    .fn()
    .mockReturnValue([jest.fn(), { error: null }]);
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
