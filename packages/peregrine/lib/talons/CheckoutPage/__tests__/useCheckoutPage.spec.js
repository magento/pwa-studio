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
import { useCartContext } from '../../../context/cart';
import { useUserContext } from '../../../context/user';
import { clearCartDataFromCache } from '../../../Apollo/clearCartDataFromCache';

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

test('returned error prop should be error from place order mutation', () => {
    const error = 'some error';
    placeOrderMutationResult.mockReturnValueOnce([
        () => {},
        {
            data: null,
            loading: false,
            error
        }
    ]);

    const { talonProps } = getTalonProps(props);

    expect(talonProps.error).toBe(error);
});

describe('handlePlaceOrder', () => {
    test('should get order details and place order', async () => {
        useCartContext.mockReturnValueOnce([
            { cartId: '123' },
            { createCart: () => {}, removeCart: () => {} }
        ]);

        const { talonProps } = getTalonProps(props);

        await talonProps.handlePlaceOrder();

        expect(getOrderDetails).toHaveBeenCalledWith({
            variables: { cartId: '123' }
        });
        expect(placeOrder).toHaveBeenCalledWith({
            variables: { cartId: '123' }
        });
    });

    test('should remove and create new cart', async () => {
        const createCart = jest.fn();
        const removeCart = jest.fn();
        const fetchCartId = jest.fn();
        useCartContext.mockReturnValueOnce([
            { cartId: '123' },
            { createCart, removeCart }
        ]);
        createCartMutationResult.mockReturnValue([fetchCartId]);

        const { talonProps } = getTalonProps(props);

        await talonProps.handlePlaceOrder();

        expect(removeCart).toHaveBeenCalled();
        expect(createCart).toHaveBeenCalledWith({ fetchCartId });
    });

    test('should clear cart data from cache', async () => {
        const { talonProps } = getTalonProps(props);

        await talonProps.handlePlaceOrder();

        expect(clearCartDataFromCache).toHaveBeenCalledWith(client);
    });
});

test('hasError should be true if place order mutation failed with errors', () => {
    placeOrderMutationResult.mockReturnValueOnce([
        () => {},
        { data: null, loading: false, error: 'some error' }
    ]);

    const { talonProps } = getTalonProps(props);

    expect(talonProps.hasError).toBeTruthy();
});

describe('isCartEmpty', () => {
    test('should be true if checkout data is falsy', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: null,
            error: null,
            loading: false
        });

        const { talonProps } = getTalonProps(props);

        expect(talonProps.isCartEmpty).toBeTruthy();
    });

    test('should be true if total quantity is 0', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: {
                cart: {
                    total_quantity: 0
                }
            },
            error: null,
            loading: false
        });

        const { talonProps } = getTalonProps(props);

        expect(talonProps.isCartEmpty).toBeTruthy();
    });

    test('should be false if total quantity is not 0', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: {
                cart: {
                    total_quantity: 5
                }
            },
            error: null,
            loading: false
        });

        const { talonProps } = getTalonProps(props);

        expect(talonProps.isCartEmpty).toBeFalsy();
    });
});

test('isGuestCheckout should be negation of isSignedIn from useUserContext', () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: false }]);

    const { talonProps, update } = getTalonProps(props);

    expect(talonProps.isGuestCheckout).toBeTruthy();

    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);

    const newTalonProps = update();

    expect(newTalonProps.isGuestCheckout).toBeFalsy();
});

test('orderDetailsData should be data from getOrderDetailsQuery', () => {
    const data = 'some data';
    getOrderDetailsQueryResult.mockReturnValueOnce([
        () => {},
        {
            data,
            loading: false,
            error: null
        }
    ]);

    const { talonProps } = getTalonProps(props);

    expect(talonProps.orderDetailsData).toBe(data);
});

test('orderDetailsLoading should be data from getOrderDetailsQuery', () => {
    getOrderDetailsQueryResult.mockReturnValueOnce([
        () => {},
        {
            data: null,
            loading: true,
            error: null
        }
    ]);

    const { talonProps } = getTalonProps(props);

    expect(talonProps.orderDetailsLoading).toBeTruthy();
});
