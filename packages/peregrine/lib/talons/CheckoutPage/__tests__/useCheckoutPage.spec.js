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

const readQuery = jest.fn().mockReturnValue({ cart: {} });
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

test('orderDetailsLoading should be loading status of the getOrderDetailsQuery', () => {
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

test('orderNumber should be the order_number from the place order mutation result', () => {
    placeOrderMutationResult.mockReturnValueOnce([
        () => {},
        {
            data: {
                placeOrder: {
                    order: {
                        order_number: '123'
                    }
                }
            },
            loading: false,
            error: null
        }
    ]);

    const { talonProps } = getTalonProps(props);

    expect(talonProps.orderNumber).toBe('123');
});

test('orderNumber should be the null if place order mutation result is falsy', () => {
    placeOrderMutationResult.mockReturnValueOnce([
        () => {},
        {
            data: null,
            loading: false,
            error: null
        }
    ]);

    const { talonProps } = getTalonProps(props);

    expect(talonProps.orderNumber).toBeNull();
});

test('placeOrderLoading should be loading status of the place order mutation', () => {
    placeOrderMutationResult.mockReturnValueOnce([
        () => {},
        {
            data: null,
            loading: true,
            error: null
        }
    ]);

    const { talonProps } = getTalonProps(props);

    expect(talonProps.placeOrderLoading).toBeTruthy();
});

describe('setShippingInformationDone', () => {
    test('should set the checkoutStep to SHIPPING_METHOD if current checkoutStep is SHIPPING_ADDRESS', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: {
                cart: {
                    checkoutStep: CHECKOUT_STEP.SHIPPING_ADDRESS
                }
            }
        });

        const { talonProps } = getTalonProps(props);

        talonProps.setShippingInformationDone();

        expect(writeQuery.mock.calls[0][0].data.cart.checkoutStep).toBe(
            CHECKOUT_STEP.SHIPPING_METHOD
        );
    });

    test('should not set the checkoutStep to SHIPPING_METHOD if current checkoutStep is not SHIPPING_ADDRESS', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: {
                cart: {
                    checkoutStep: CHECKOUT_STEP.PAYMENT
                }
            }
        });

        const { talonProps } = getTalonProps(props);

        talonProps.setShippingInformationDone();

        expect(writeQuery).not.toBeCalled();
    });
});

describe('setShippingMethodDone', () => {
    test('should set the checkoutStep to PAYMENT if current checkoutStep is SHIPPING_METHOD', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: {
                cart: {
                    checkoutStep: CHECKOUT_STEP.SHIPPING_METHOD
                }
            }
        });

        const { talonProps } = getTalonProps(props);

        talonProps.setShippingMethodDone();

        expect(writeQuery.mock.calls[0][0].data.cart.checkoutStep).toBe(
            CHECKOUT_STEP.PAYMENT
        );
    });

    test('should not set the checkoutStep to PAYMENT if current checkoutStep is not SHIPPING_METHOD', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: {
                cart: {
                    checkoutStep: CHECKOUT_STEP.SHIPPING_ADDRESS
                }
            }
        });

        const { talonProps } = getTalonProps(props);

        talonProps.setShippingMethodDone();

        expect(writeQuery).not.toBeCalled();
    });
});

describe('setPaymentInformationDone', () => {
    test('should set the checkoutStep to REVIEW if current checkoutStep is PAYMENT', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: {
                cart: {
                    checkoutStep: CHECKOUT_STEP.PAYMENT
                }
            }
        });

        const { talonProps } = getTalonProps(props);

        talonProps.setPaymentInformationDone();

        expect(writeQuery.mock.calls[0][0].data.cart.checkoutStep).toBe(
            CHECKOUT_STEP.REVIEW
        );
    });

    test('should not set the checkoutStep to REVIEW if current checkoutStep is not PAYMENT', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: {
                cart: {
                    checkoutStep: CHECKOUT_STEP.SHIPPING_ADDRESS
                }
            }
        });

        const { talonProps } = getTalonProps(props);

        talonProps.setPaymentInformationDone();

        expect(writeQuery).not.toBeCalled();
    });
});

test('handleReviewOrder should set reviewOrderButtonClicked to true', () => {
    const { talonProps, update } = getTalonProps(props);

    expect(talonProps.reviewOrderButtonClicked).toBeFalsy();

    talonProps.handleReviewOrder();

    const newTalonProps = update();

    expect(newTalonProps.reviewOrderButtonClicked).toBeTruthy();
});

test('resetReviewOrderButtonClicked should set reviewOrderButtonClicked to false', () => {
    const { talonProps, update } = getTalonProps(props);

    expect(talonProps.reviewOrderButtonClicked).toBeFalsy();

    talonProps.handleReviewOrder();

    const step1Props = update();

    expect(step1Props.reviewOrderButtonClicked).toBeTruthy();

    talonProps.resetReviewOrderButtonClicked();

    const step2Props = update();

    expect(step2Props.reviewOrderButtonClicked).toBeFalsy();
});
