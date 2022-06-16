// import { GET_CHECKOUT_DETAILS } from "@magento/peregrine/lib/talons/CheckoutPage/checkoutPage.gql";
// import { useQuery } from "@apollo/client";
// import { useCartContext } from "@magento/peregrine/lib/context/cart";
// import { useCallback, useState } from 'react';
import { SAVE_ADDITIONAL_INFO_TRIGGER } from './useAdditionalData';
import { CHECKOUT_STEP } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/checkoutPage.gql.js';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';

export default original => {
    return function useCheckoutPage(props, ...restArgs) {
        // const [{ cartId }] = useCartContext();

        // // Run the original, wrapped function
        // let { ...defaultReturnData } = original(props, ...restArgs);

        // useQuery(GET_CHECKOUT_DETAILS, {
        //   fetchPolicy: "network-only",
        //   variables: {
        //     cartId
        //   }
        // });

        // console.log('defaultReturnData', defaultReturnData)

        // // const setPaymentInformationDone = useCallback(() => {
        // //   console.log('setPaymentInformationDone')
        // //   if (defaultReturnData.checkoutStep === CHECKOUT_STEP.PAYMENT) {
        // //     globalThis.scrollTo({
        // //       left: 0,
        // //       top: 0,
        // //       behavior: 'smooth'
        // //     });
        // //     window.dispatchEvent(new CustomEvent(SAVE_ADDITIONAL_INFO_TRIGGER));
        // //     setTimeout(()=>{
        // //       defaultReturnData.setCheckoutStep(CHECKOUT_STEP.REVIEW);
        // //     }, 3000)

        // //   }

        // // }, [defaultReturnData.checkoutStep, defaultReturnData]);

        // // defaultReturnData.handleReviewOrder

        // const handleReviewOrder = useCallback(() => {
        //   window.dispatchEvent(new CustomEvent(SAVE_ADDITIONAL_INFO_TRIGGER));
        //   defaultReturnData.setReviewOrderButtonClicked(true);
        // }, [defaultReturnData]);

        // return {
        //   ...defaultReturnData,
        //   handleReviewOrder,

        // };

        const operations = mergeOperations(DEFAULT_OPERATIONS, {});

        const {
            createCartMutation,
            getCheckoutDetailsQuery,
            getCustomerQuery,
            getOrderDetailsQuery,
            placeOrderMutation
        } = operations;

        const [reviewOrderButtonClicked, setReviewOrderButtonClicked] = useState(false);

        const shippingInformationRef = useRef();
        const shippingMethodRef = useRef();

        const apolloClient = useApolloClient();
        const [isUpdating, setIsUpdating] = useState(false);
        const [activeContent, setActiveContent] = useState('checkout');
        const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEP.SHIPPING_ADDRESS);
        const [{ isSignedIn }] = useUserContext();
        const [{ cartId }, { createCart, removeCart }] = useCartContext();

        const [fetchCartId] = useMutation(createCartMutation);
        const [placeOrder, { data: placeOrderData, error: placeOrderError, loading: placeOrderLoading }] = useMutation(
            placeOrderMutation
        );

        const [getOrderDetails, { data: orderDetailsData, loading: orderDetailsLoading }] = useLazyQuery(
            getOrderDetailsQuery,
            {
                // We use this query to fetch details _just_ before submission, so we
                // want to make sure it is fresh. We also don't want to cache this data
                // because it may contain PII.
                fetchPolicy: 'no-cache'
            }
        );

        const { data: customerData, loading: customerLoading } = useQuery(getCustomerQuery, { skip: !isSignedIn });

        const { data: checkoutData, networkStatus: checkoutQueryNetworkStatus } = useQuery(getCheckoutDetailsQuery, {
            /**
             * Skip fetching checkout details if the `cartId`
             * is a falsy value.
             */
            skip: !cartId,
            notifyOnNetworkStatusChange: true,
            variables: {
                cartId
            }
        });

        const cartItems = useMemo(() => {
            return (checkoutData && checkoutData.cart.items) || [];
        }, [checkoutData]);

        /**
         * For more info about network statues check this out
         *
         * https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
         */
        const isLoading = useMemo(() => {
            const checkoutQueryInFlight = checkoutQueryNetworkStatus ? checkoutQueryNetworkStatus < 7 : true;

            return checkoutQueryInFlight || customerLoading;
        }, [checkoutQueryNetworkStatus, customerLoading]);

        const customer = customerData && customerData.customer;

        const toggleAddressBookContent = useCallback(() => {
            setActiveContent(currentlyActive => (currentlyActive === 'checkout' ? 'addressBook' : 'checkout'));
        }, []);
        const toggleSignInContent = useCallback(() => {
            setActiveContent(currentlyActive => (currentlyActive === 'checkout' ? 'signIn' : 'checkout'));
        }, []);

        const checkoutError = useMemo(() => {
            if (placeOrderError) {
                return new CheckoutError(placeOrderError);
            }
        }, [placeOrderError]);

        const handleReviewOrder = useCallback(() => {
            setReviewOrderButtonClicked(true);
            window.dispatchEvent(new CustomEvent(SAVE_ADDITIONAL_INFO_TRIGGER));
        }, []);

        const resetReviewOrderButtonClicked = useCallback(() => {
            setReviewOrderButtonClicked(false);
        }, []);

        const scrollShippingInformationIntoView = useCallback(() => {
            if (shippingInformationRef.current) {
                shippingInformationRef.current.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, [shippingInformationRef]);

        const setShippingInformationDone = useCallback(() => {
            if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS) {
                setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
            }
        }, [checkoutStep]);

        const scrollShippingMethodIntoView = useCallback(() => {
            if (shippingMethodRef.current) {
                shippingMethodRef.current.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, [shippingMethodRef]);

        const setShippingMethodDone = useCallback(() => {
            if (checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD) {
                setCheckoutStep(CHECKOUT_STEP.PAYMENT);
            }
        }, [checkoutStep]);

        const setPaymentInformationDone = useCallback(() => {
            if (checkoutStep === CHECKOUT_STEP.PAYMENT) {
                globalThis.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: 'smooth'
                });
                setCheckoutStep(CHECKOUT_STEP.REVIEW);
            }
        }, [checkoutStep]);

        const [isPlacingOrder, setIsPlacingOrder] = useState(false);

        const handlePlaceOrder = useCallback(async () => {
            // Fetch order details and then use an effect to actually place the
            // order. If/when Apollo returns promises for invokers from useLazyQuery
            // we can just await this function and then perform the rest of order
            // placement.
            await getOrderDetails({
                variables: {
                    cartId
                }
            });
            setIsPlacingOrder(true);
        }, [cartId, getOrderDetails]);

        // Go back to checkout if shopper logs in
        useEffect(() => {
            if (isSignedIn) {
                setActiveContent('checkout');
            }
        }, [isSignedIn]);

        useEffect(() => {
            async function placeOrderAndCleanup() {
                try {
                    await placeOrder({
                        variables: {
                            cartId
                        }
                    });
                    // Cleanup stale cart and customer info.
                    await removeCart();
                    await clearCartDataFromCache(apolloClient);

                    await createCart({
                        fetchCartId
                    });
                } catch (err) {
                    console.error('An error occurred during when placing the order', err);
                    setReviewOrderButtonClicked(false);
                    setCheckoutStep(CHECKOUT_STEP.PAYMENT);
                }
            }

            if (orderDetailsData && isPlacingOrder) {
                setIsPlacingOrder(false);
                placeOrderAndCleanup();
            }
        }, [apolloClient, cartId, createCart, fetchCartId, orderDetailsData, placeOrder, removeCart, isPlacingOrder]);

        return {
            activeContent,
            availablePaymentMethods: checkoutData ? checkoutData.cart.available_payment_methods : null,
            cartItems,
            checkoutStep,
            customer,
            error: checkoutError,
            handlePlaceOrder,
            hasError: !!checkoutError,
            isCartEmpty: !(checkoutData && checkoutData.cart.total_quantity),
            isGuestCheckout: !isSignedIn,
            isLoading,
            isUpdating,
            orderDetailsData,
            orderDetailsLoading,
            orderNumber: (placeOrderData && placeOrderData.placeOrder.order.order_number) || null,
            placeOrderLoading,
            setCheckoutStep,
            setIsUpdating,
            setShippingInformationDone,
            setShippingMethodDone,
            setPaymentInformationDone,
            scrollShippingInformationIntoView,
            shippingInformationRef,
            shippingMethodRef,
            scrollShippingMethodIntoView,
            resetReviewOrderButtonClicked,
            handleReviewOrder,
            reviewOrderButtonClicked,
            toggleAddressBookContent,
            toggleSignInContent
        };
    };
};
