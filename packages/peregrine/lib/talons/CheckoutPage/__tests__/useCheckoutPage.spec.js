import React from 'react';
import {
    useLazyQuery,
    useApolloClient,
    useMutation,
    useQuery
} from '@apollo/react-hooks';
import { act } from 'react-test-renderer';

import { useCheckoutPage, CHECKOUT_STEP } from '../useCheckoutPage';
import createTestInstance from '../../../util/createTestInstance';

/**
 * Mocks
 */

jest.mock('@apollo/react-hooks', () => {
    return {
        useLazyQuery: jest.fn(),
        useApolloClient: jest.fn(),
        useMutation: jest.fn(),
        useQuery: jest.fn()
    };
});

jest.mock('../../../context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: false }])
}));

jest.mock('../../../context/app', () => ({
    useAppContext: jest.fn().mockReturnValue([{}, { toggleDrawer: jest.fn() }])
}));

jest.mock('../../../context/cart', () => ({
    useCartContext: jest
        .fn()
        .mockReturnValue([
            { cartId: '123' },
            { createCart: jest.fn(), removeCart: jest.fn() }
        ])
}));

jest.mock('../../../Apollo/clearCartDataFromCache', () => ({
    clearCartDataFromCache: jest.fn()
}));

/**
 * Constants
 */

const createCartMutation = 'createCartMutation';
const placeOrderMutation = 'placeOrderMutation';
const getCheckoutDetailsQuery = 'getCheckoutDetailsQuery';
const getOrderDetailsQuery = 'getOrderDetailsQuery';

const props = {
    mutations: { createCartMutation, placeOrderMutation },
    queries: { getCheckoutDetailsQuery, getOrderDetailsQuery }
};

const readQuery = jest.fn();
const writeQuery = jest.fn();
const client = { readQuery, writeQuery };

const getOrderDetails = jest.fn();
const getOrderDetailsQueryResult = jest.fn().mockReturnValue([
    getOrderDetails,
    {
        data: null,
        loading: false,
        called: false
    }
]);

const getCheckoutDetailsQueryResult = jest.fn().mockReturnValue({
    data: null,
    networkStatus: 0
});

const createCart = jest.fn();
const createCartMutationResult = jest.fn().mockReturnValue([
    createCart,
    {
        error: null,
        loading: false,
        data: null
    }
]);
const placeOrder = jest.fn();
const placeOrderMutationResult = jest.fn().mockReturnValue([
    placeOrder,
    {
        error: null,
        loading: false,
        data: null
    }
]);

/**
 * Helpers
 */

const Component = props => {
    const talonProps = useCheckoutPage(props);

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

/**
 * beforeAll
 */

beforeAll(() => {
    useQuery.mockImplementation(query => {
        if (query === getCheckoutDetailsQuery) {
            return getCheckoutDetailsQueryResult();
        } else {
            return {};
        }
    });

    useLazyQuery.mockImplementation(query => {
        if (query === getOrderDetailsQuery) {
            return getOrderDetailsQueryResult();
        } else {
            return [jest.fn(), {}];
        }
    });

    useMutation.mockImplementation(mutation => {
        if (mutation === createCartMutation) {
            return createCartMutationResult();
        } else if (mutation === placeOrderMutation) {
            return placeOrderMutationResult();
        } else {
            return [jest.fn(), {}];
        }
    });

    useApolloClient.mockReturnValue(client);
});

/**
 * Tests
 */

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps(props);

    expect(talonProps).toMatchSnapshot();
});

test('isLoading should be set to true if the checkout details query networkStatus is less than 7', () => {
    getCheckoutDetailsQueryResult.mockReturnValueOnce({
        data: null,
        networkStatus: 4
    });

    const { talonProps, update } = getTalonProps(props);

    expect(talonProps.isLoading).toBeTruthy();

    getCheckoutDetailsQueryResult.mockReturnValueOnce({
        data: {
            cart: {
                checkoutStep: CHECKOUT_STEP.SHIPPING_ADDRESS
            }
        },
        networkStatus: 8
    });

    const newTalonProps = update();

    expect(newTalonProps.isLoading).toBeFalsy();
});
