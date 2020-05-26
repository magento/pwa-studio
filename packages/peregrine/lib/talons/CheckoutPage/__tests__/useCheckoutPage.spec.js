import React from 'react';
import {
    useLazyQuery,
    useApolloClient,
    useMutation
} from '@apollo/react-hooks';
import { act } from 'react-test-renderer';

import { useCheckoutPage } from '../useCheckoutPage';
import createTestInstance from '../../../util/createTestInstance';
import { useCartContext } from '../../../context/cart';

/**
 * Mocks
 */

jest.mock('@apollo/react-hooks', () => {
    return {
        useLazyQuery: jest.fn(),
        useApolloClient: jest.fn(),
        useMutation: jest.fn()
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
const getCheckoutDetails = jest.fn();
const getCheckoutDetailsQueryResult = jest.fn().mockReturnValue([
    getCheckoutDetails,
    {
        data: null,
        loading: false,
        called: false
    }
]);

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
    useLazyQuery.mockImplementation(query => {
        if (query === getCheckoutDetailsQuery) {
            return getCheckoutDetailsQueryResult();
        } else if (query === getOrderDetailsQuery) {
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

test('Should get checkout details if cartId changes and order has not been placed yet', () => {
    useCartContext.mockReturnValueOnce([
        { cartId: '123' },
        { createCart: jest.fn(), removeCart: jest.fn() }
    ]);

    const { update } = getTalonProps(props);

    expect(getCheckoutDetails.mock.calls[0][0]).toMatchObject({
        variables: { cartId: '123' }
    });
    expect(getCheckoutDetails.mock.calls.length).toBe(1);

    useCartContext.mockReturnValueOnce([
        { cartId: 'abc' },
        { createCart: jest.fn(), removeCart: jest.fn() }
    ]);

    update();

    expect(getCheckoutDetails.mock.calls[1][0]).toMatchObject({
        variables: { cartId: 'abc' }
    });
    expect(getCheckoutDetails.mock.calls.length).toBe(2);

    useCartContext.mockReturnValueOnce([
        { cartId: 'xyz' },
        { createCart: jest.fn(), removeCart: jest.fn() }
    ]);
    placeOrderMutationResult.mockReturnValueOnce([
        placeOrder,
        {
            error: null,
            loading: false,
            data: {
                placeOrder: { order: { order_number: '000000' } }
            }
        }
    ]);

    update();

    expect(getCheckoutDetails.mock.calls.length).toBe(2);
});
