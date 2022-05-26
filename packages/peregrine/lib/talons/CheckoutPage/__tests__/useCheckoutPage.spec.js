import React, { useRef } from 'react';
import {
    useLazyQuery,
    useApolloClient,
    useMutation,
    useQuery
} from '@apollo/client';
import { act } from 'react-test-renderer';

import { useCheckoutPage, CHECKOUT_STEP } from '../useCheckoutPage';
import createTestInstance from '../../../util/createTestInstance';
import { useCartContext } from '../../../context/cart';
import { useUserContext } from '../../../context/user';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import CheckoutError from '../CheckoutError';

/**
 * Mocks
 */

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useLazyQuery: jest.fn(),
        useApolloClient: jest.fn(),
        useMutation: jest.fn(),
        useQuery: jest.fn()
    };
});

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn().mockReturnValue({
        current: {
            scrollIntoView: jest.fn()
        }
    })
}));

jest.mock('../../../context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: false }])
}));

jest.mock('../../../context/cart', () => ({
    useCartContext: jest
        .fn()
        .mockReturnValue([
            { cartId: '123' },
            { createCart: jest.fn(), removeCart: jest.fn() }
        ])
}));

jest.mock('../CheckoutError', () => {
    class CheckoutError extends Error {
        constructor(props) {
            super(props);
        }
    }

    return CheckoutError;
});

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

/**
 * Constants
 */

const createCartMutation = 'createCartMutation';
const placeOrderMutation = 'placeOrderMutation';
const getCheckoutDetailsQuery = 'getCheckoutDetailsQuery';
const getOrderDetailsQuery = 'getOrderDetailsQuery';
const getCustomerQuery = 'getCustomerQuery';

const defaultProps = {
    operations: {
        createCartMutation,
        getCheckoutDetailsQuery,
        getOrderDetailsQuery,
        getCustomerQuery,
        placeOrderMutation
    }
};

const readQuery = jest.fn().mockReturnValue({ cart: {} });
const writeQuery = jest.fn();
const clearCacheData = jest.fn();
const client = { readQuery, writeQuery, clearCacheData };

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
    networkStatus: 1
});

const getCustomerQueryResult = jest.fn().mockReturnValue({
    data: { customer: { name: 'gooseton', id: 'goose123' } },
    loading: false
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
        data: null,
        called: false
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

beforeEach(() => {
    useQuery.mockImplementation(query => {
        if (query === getCheckoutDetailsQuery) {
            return getCheckoutDetailsQueryResult();
        } else if (query === getCustomerQuery) {
            return getCustomerQueryResult();
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

    globalThis.scrollTo = jest.fn();
});

/**
 * Tests
 */

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('isLoading should be set to true if the checkout details query networkStatus is less than 7', () => {
    getCheckoutDetailsQueryResult.mockReturnValueOnce({
        data: null,
        networkStatus: 4
    });

    const { talonProps, update } = getTalonProps(defaultProps);

    expect(talonProps.isLoading).toBeTruthy();

    getCheckoutDetailsQueryResult.mockReturnValueOnce({
        data: {
            cart: {
                checkoutStep: CHECKOUT_STEP.SHIPPING_ADDRESS
            }
        },
        networkStatus: 7
    });

    const newTalonProps = update();

    expect(newTalonProps.isLoading).toBeFalsy();
});

test('isLoading should be set to true if the customer details query is loading', () => {
    getCheckoutDetailsQueryResult.mockReturnValueOnce({
        data: null,
        networkStatus: 8
    });
    getCustomerQueryResult.mockReturnValueOnce({
        data: null,
        loading: true
    });

    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps.isLoading).toBeTruthy();
});

test('returns cartItems from getOrderDetails query', () => {
    const cartItems = ['item1', 'item2'];
    getCheckoutDetailsQueryResult.mockReturnValueOnce({
        data: { cart: { items: cartItems } }
    });
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps.cartItems).toEqual(cartItems);
});

test('returned error prop should be error from place order mutation', () => {
    const error = { gqlError: { message: 'some error' } };
    placeOrderMutationResult.mockReturnValueOnce([
        () => {},
        {
            data: null,
            loading: false,
            error
        }
    ]);

    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps.error).toBeInstanceOf(CheckoutError);
});

test('should get order details when handlePlaceOrder called', () => {
    useCartContext.mockReturnValueOnce([
        { cartId: '123' },
        { createCart: () => {}, removeCart: () => {} }
    ]);

    const { talonProps } = getTalonProps(defaultProps);

    act(() => {
        talonProps.handlePlaceOrder();
    });

    expect(getOrderDetails).toHaveBeenCalledWith({
        variables: { cartId: '123' }
    });
});

test("should place order and cleanup when we have order details and place order hasn't been called yet", async () => {
    const createCart = jest.fn();
    const removeCart = jest.fn();
    const fetchCartId = jest.fn();

    useCartContext.mockReturnValue([
        { cartId: '123' },
        { createCart, removeCart }
    ]);
    createCartMutationResult.mockReturnValue([fetchCartId]);

    useLazyQuery.mockImplementation(() => {
        return [jest.fn(), { data: {}, loading: false }];
    });

    const { talonProps } = getTalonProps(defaultProps);

    await act(async () => {
        await talonProps.handlePlaceOrder();
    });

    expect(placeOrder).toHaveBeenCalledWith({
        variables: { cartId: '123' }
    });
    expect(removeCart).toHaveBeenCalled();
    expect(clearCacheData).toHaveBeenCalled();
    expect(createCart).toHaveBeenCalledWith({ fetchCartId });
});

test('should be able to place order again when an error ocurrs during placeOrderAndCleanup()', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const createCart = jest.fn();
    const removeCart = jest.fn(() => {
        throw new Error('some error');
    });
    const fetchCartId = jest.fn();

    useCartContext.mockReturnValue([
        { cartId: '123' },
        { createCart, removeCart }
    ]);
    createCartMutationResult.mockReturnValue([fetchCartId]);

    useLazyQuery.mockImplementation(() => {
        return [jest.fn(), { data: {}, loading: false }];
    });

    const { talonProps, update } = getTalonProps(defaultProps);

    await act(async () => {
        await talonProps.handlePlaceOrder();
    });

    const updatedProps = update(defaultProps);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(updatedProps.placeOrderButtonClicked).toBeFalsy();
});

test('hasError should be true if place order mutation failed with errors', () => {
    placeOrderMutationResult.mockReturnValueOnce([
        () => {},
        {
            data: null,
            loading: false,
            error: { gqlError: { message: 'some error' } }
        }
    ]);

    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps.hasError).toBeTruthy();
});

describe('isCartEmpty', () => {
    test('should be true if checkout data is falsy', () => {
        getCheckoutDetailsQueryResult.mockReturnValueOnce({
            data: null,
            error: null,
            loading: false
        });

        const { talonProps } = getTalonProps(defaultProps);

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

        const { talonProps } = getTalonProps(defaultProps);

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

        const { talonProps } = getTalonProps(defaultProps);

        expect(talonProps.isCartEmpty).toBeFalsy();
    });
});

test('isGuestCheckout should be negation of isSignedIn from useUserContext', () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: false }]);

    const { talonProps, update } = getTalonProps(defaultProps);

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

    const { talonProps } = getTalonProps(defaultProps);

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

    const { talonProps } = getTalonProps(defaultProps);

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

    const { talonProps } = getTalonProps(defaultProps);

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

    const { talonProps } = getTalonProps(defaultProps);

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

    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps.placeOrderLoading).toBeTruthy();
});

describe('setShippingInformationDone', () => {
    test('should set the checkoutStep to SHIPPING_METHOD if current checkoutStep is SHIPPING_ADDRESS', () => {
        const { talonProps, update } = getTalonProps(defaultProps);

        talonProps.setCheckoutStep(CHECKOUT_STEP.SHIPPING_ADDRESS);

        const step1Props = update();

        expect(step1Props.checkoutStep).toBe(CHECKOUT_STEP.SHIPPING_ADDRESS);

        step1Props.setShippingInformationDone();

        const step2Props = update();

        expect(step2Props.checkoutStep).toBe(CHECKOUT_STEP.SHIPPING_METHOD);
    });

    test('should not set the checkoutStep to SHIPPING_METHOD if current checkoutStep is not SHIPPING_ADDRESS', () => {
        const { talonProps, update } = getTalonProps(defaultProps);

        talonProps.setCheckoutStep(CHECKOUT_STEP.PAYMENT);

        const step1Props = update();

        expect(step1Props.checkoutStep).toBe(CHECKOUT_STEP.PAYMENT);

        step1Props.setShippingInformationDone();

        const step2Props = update();

        expect(step2Props.checkoutStep).toBe(CHECKOUT_STEP.PAYMENT);
    });
});

describe('setShippingMethodDone', () => {
    test('should set the checkoutStep to PAYMENT if current checkoutStep is SHIPPING_METHOD', () => {
        const { talonProps, update } = getTalonProps(defaultProps);

        talonProps.setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);

        const step1Props = update();

        expect(step1Props.checkoutStep).toBe(CHECKOUT_STEP.SHIPPING_METHOD);

        step1Props.setShippingMethodDone();

        const step2Props = update();

        expect(step2Props.checkoutStep).toBe(CHECKOUT_STEP.PAYMENT);
    });

    test('should not set the checkoutStep to PAYMENT if current checkoutStep is not SHIPPING_METHOD', () => {
        const { talonProps, update } = getTalonProps(defaultProps);

        talonProps.setCheckoutStep(CHECKOUT_STEP.REVIEW);

        const step1Props = update();

        expect(step1Props.checkoutStep).toBe(CHECKOUT_STEP.REVIEW);

        step1Props.setShippingMethodDone();

        const step2Props = update();

        expect(step2Props.checkoutStep).toBe(CHECKOUT_STEP.REVIEW);
    });
});

describe('setPaymentInformationDone', () => {
    test('should set the checkoutStep to REVIEW if current checkoutStep is PAYMENT', () => {
        const { talonProps, update } = getTalonProps(defaultProps);

        talonProps.setCheckoutStep(CHECKOUT_STEP.PAYMENT);

        const step1Props = update();

        expect(step1Props.checkoutStep).toBe(CHECKOUT_STEP.PAYMENT);

        step1Props.setPaymentInformationDone();

        const step2Props = update();

        expect(step2Props.checkoutStep).toBe(CHECKOUT_STEP.REVIEW);
    });

    test('should not set the checkoutStep to REVIEW if current checkoutStep is not PAYMENT', () => {
        const { talonProps, update } = getTalonProps(defaultProps);

        talonProps.setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);

        const step1Props = update();

        expect(step1Props.checkoutStep).toBe(CHECKOUT_STEP.SHIPPING_METHOD);

        step1Props.setPaymentInformationDone();

        const step2Props = update();

        expect(step2Props.checkoutStep).toBe(CHECKOUT_STEP.SHIPPING_METHOD);
    });
});

test('handleReviewOrder should set reviewOrderButtonClicked to true', () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    expect(talonProps.reviewOrderButtonClicked).toBeFalsy();

    talonProps.handleReviewOrder();

    const newTalonProps = update();

    expect(newTalonProps.reviewOrderButtonClicked).toBeTruthy();
});

test('resetReviewOrderButtonClicked should set reviewOrderButtonClicked to false', () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    expect(talonProps.reviewOrderButtonClicked).toBeFalsy();

    talonProps.handleReviewOrder();

    const step1Props = update();

    expect(step1Props.reviewOrderButtonClicked).toBeTruthy();

    talonProps.resetReviewOrderButtonClicked();

    const step2Props = update();

    expect(step2Props.reviewOrderButtonClicked).toBeFalsy();
});

test('toggles addressBook content', () => {
    const { talonProps: initialProps, update } = getTalonProps(defaultProps);

    initialProps.toggleAddressBookContent();
    const step1Props = update();

    expect(step1Props.activeContent).toBe('addressBook');

    step1Props.toggleAddressBookContent();
    const step2Props = update();

    expect(step2Props.activeContent).toBe('checkout');
});

test('toggles signIn content', () => {
    const { talonProps: initialProps, update } = getTalonProps(defaultProps);

    initialProps.toggleSignInContent();
    const step1Props = update();

    expect(step1Props.activeContent).toBe('signIn');

    step1Props.toggleSignInContent();
    const step2Props = update();

    expect(step2Props.activeContent).toBe('checkout');
});

test('resets active content to checkout on sign in', () => {
    const { talonProps: initialProps, update } = getTalonProps(defaultProps);

    initialProps.toggleSignInContent();
    const step1Props = update();

    expect(step1Props.activeContent).toBe('signIn');

    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
    const step2Props = update();

    expect(step2Props.activeContent).toBe('checkout');
});

test('check availablePaymentMethods, if not implemented then show page level message', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps.availablePaymentMethods).toBeNull();
});

test('should scroll shipping information into view when scrollShippingInformationIntoView is called', () => {
    const scrollIntoView = jest.fn();
    useRef.mockReturnValueOnce({ current: { scrollIntoView } });

    const { talonProps } = getTalonProps(defaultProps);

    talonProps.scrollShippingInformationIntoView();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
});

test('should scroll shipping method into view when scrollShippingMethodIntoView is called', () => {
    const scrollIntoView = jest.fn();
    useRef
        .mockReturnValueOnce({ current: { scrollIntoView: jest.fn() } })
        .mockReturnValueOnce({ current: { scrollIntoView } });

    const { talonProps } = getTalonProps(defaultProps);

    talonProps.scrollShippingMethodIntoView();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
});

test('should dispatch checkout page view event', () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([{}, { dispatch: mockDispatchEvent }]);

    const cartItems = ['item1', 'item2'];
    getCheckoutDetailsQueryResult.mockReturnValueOnce({
        data: { cart: { cart_id: '123', items: cartItems } }
    });

    getTalonProps(defaultProps);

    expect(mockDispatchEvent).toBeCalledTimes(1);

    expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
});

test('should dispatch checkout review button clicked event', () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([{}, { dispatch: mockDispatchEvent }]);

    const { talonProps, update } = getTalonProps(defaultProps);

    talonProps.handleReviewOrder();

    update();

    expect(mockDispatchEvent).toBeCalledTimes(1);
    expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
});

test('should dispatch place order button clicked event', async () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([{}, { dispatch: mockDispatchEvent }]);

    useLazyQuery.mockImplementation(() => {
        return [
            jest.fn(),
            { data: { cart: { id: '123', total_quantity: 5 } }, loading: false }
        ];
    });

    const { talonProps } = getTalonProps(defaultProps);

    await act(async () => {
        await talonProps.handlePlaceOrder();
    });

    expect(mockDispatchEvent).toBeCalledTimes(1);
    expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
});

test('should dispatch order confirmation page view event', async () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([{}, { dispatch: mockDispatchEvent }]);

    placeOrderMutationResult
        .mockReturnValueOnce([() => {}, { data: null, loading: false }])
        .mockReturnValueOnce([
            () => {},
            {
                data: { placeOrder: { order: { order_number: '001' } } },
                loading: false
            }
        ]);

    getOrderDetailsQueryResult
        .mockReturnValueOnce([
            () => {},
            { data: null, loading: false, error: null }
        ])
        .mockReturnValueOnce([
            () => {},
            {
                data: {
                    cart: {
                        id: '123',
                        shipping_addresses: [
                            {
                                firstname: 'firstname',
                                lastname: 'lastname',
                                selected_shipping_method: {
                                    carrier_title: 'carrier',
                                    method_title: 'method'
                                }
                            }
                        ]
                    }
                },
                loading: false,
                error: null
            }
        ]);

    const { talonProps } = getTalonProps(defaultProps);

    await act(async () => {
        await talonProps.handlePlaceOrder();
    });

    expect(mockDispatchEvent).toBeCalledTimes(1);
    expect(mockDispatchEvent.mock.calls).toMatchSnapshot();
});
