import { useCallback, useEffect, useState, useMemo } from 'react';
import {
    useApolloClient,
    useLazyQuery,
    useMutation
} from '@apollo/react-hooks';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';
import { clearCartDataFromCache } from '../../Apollo/clearCartDataFromCache';
import CheckoutError from './CheckoutError';

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4
};

export const useCheckoutPage = props => {
    const {
        mutations: { createCartMutation, placeOrderMutation },
        queries: { getCheckoutDetailsQuery, getOrderDetailsQuery }
    } = props;

    const [reviewOrderButtonClicked, setReviewOrderButtonClicked] = useState(
        false
    );

    const apolloClient = useApolloClient();
    const [isUpdating, setIsUpdating] = useState(false);

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const [
        placeOrder,
        {
            data: placeOrderData,
            error: placeOrderError,
            loading: placeOrderLoading
        }
    ] = useMutation(placeOrderMutation);

    const [
        getOrderDetails,
        { data: orderDetailsData, loading: orderDetailsLoading }
    ] = useLazyQuery(getOrderDetailsQuery, {
        // We use this query to fetch details _just_ before submission, so we
        // want to make sure it is fresh. We also don't want to cache this data
        // because it may contain PII.
        fetchPolicy: 'network-only'
    });

    const [
        getCheckoutDetails,
        {
            data: checkoutData,
            called: checkoutCalled,
            client,
            loading: checkoutLoading
        }
    ] = useLazyQuery(getCheckoutDetailsQuery);

    const checkoutStep = checkoutData && checkoutData.cart.checkoutStep;

    const checkoutError = useMemo(() => {
        if (placeOrderError) {
            return new CheckoutError(placeOrderError);
        }
    }, [placeOrderError]);

    const setCheckoutStep = useCallback(
        step => {
            const { cart: previousCart } = client.readQuery({
                query: getCheckoutDetailsQuery
            });

            client.writeQuery({
                query: getCheckoutDetailsQuery,
                data: {
                    cart: {
                        ...previousCart,
                        checkoutStep: step
                    }
                }
            });
        },
        [client, getCheckoutDetailsQuery]
    );

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    const handleReviewOrder = useCallback(() => {
        setReviewOrderButtonClicked(true);
    }, []);

    const resetReviewOrderButtonClicked = useCallback(() => {
        setReviewOrderButtonClicked(false);
    }, [setReviewOrderButtonClicked]);

    const setShippingInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS) {
            setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
        }
    }, [checkoutStep, setCheckoutStep]);

    const setShippingMethodDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD) {
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
        }
    }, [checkoutStep, setCheckoutStep]);

    const setPaymentInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.PAYMENT) {
            setCheckoutStep(CHECKOUT_STEP.REVIEW);
        }
    }, [checkoutStep, setCheckoutStep]);

    const revertPaymentInformationDone = useCallback(() => {
        /**
         * This step will reset the checkout step to PAYMENT.
         *
         * This function will be called when the placeOrder mutation
         * has failed due to payment information issues. By resetting
         * the step to PAYMENT, we will make the user re-enter the
         * payment information.
         */
        setCheckoutStep(CHECKOUT_STEP.PAYMENT);
    }, [setCheckoutStep]);

    const handlePlaceOrder = useCallback(async () => {
        await getOrderDetails({
            variables: {
                cartId
            }
        });

        await placeOrder({
            variables: {
                cartId
            }
        });

        await removeCart();

        await clearCartDataFromCache(apolloClient);

        await createCart({
            fetchCartId
        });
    }, [
        apolloClient,
        cartId,
        createCart,
        fetchCartId,
        getOrderDetails,
        placeOrder,
        removeCart
    ]);

    useEffect(() => {
        if (cartId) {
            getCheckoutDetails({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, getCheckoutDetails]);

    return {
        checkoutStep,
        error: checkoutError,
        handleSignIn,
        handlePlaceOrder,
        hasError: !!checkoutError,
        isCartEmpty: !(checkoutData && checkoutData.cart.total_quantity),
        isGuestCheckout: !isSignedIn,
        isLoading: !checkoutCalled || (checkoutCalled && checkoutLoading),
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber:
            (placeOrderData && placeOrderData.placeOrder.order.order_number) ||
            null,
        placeOrderLoading,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        revertPaymentInformationDone
    };
};
