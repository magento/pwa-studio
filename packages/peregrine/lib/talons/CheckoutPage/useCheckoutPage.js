import { useCallback, useEffect, useState } from 'react';
import {
    useApolloClient,
    useLazyQuery,
    useMutation
} from '@apollo/react-hooks';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';
import { deleteCacheEntry } from '../../Apollo/deleteCacheEntry';

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4
};

export const useCheckoutPage = props => {
    const {
        mutations: { createCartMutation, placeOrderMutation },
        queries: {
            getCheckoutDetailsQuery,
            getCheckoutStepQuery,
            getOrderDetailsQuery
        }
    } = props;

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
        { data: checkoutData, loading: checkoutLoading }
    ] = useLazyQuery(getCheckoutDetailsQuery, {
        // TODO: Purposely overfetch and hit the network until all components
        // are correctly updating the cache. Will be fixed by PWA-321.
        fetchPolicy: 'cache-and-network'
    });

    const [getCheckoutStep, { data: stepData, client }] = useLazyQuery(
        getCheckoutStepQuery
    );

    const setCheckoutStep = useCallback(
        step => {
            client.writeQuery({
                query: getCheckoutStepQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        checkoutStep: step
                    }
                }
            });
        },
        [cartId, client, getCheckoutStepQuery]
    );

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    const setShippingInformationDone = useCallback(
        () => setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD),
        [setCheckoutStep]
    );
    const setShippingMethodDone = useCallback(
        () => setCheckoutStep(CHECKOUT_STEP.PAYMENT),
        [setCheckoutStep]
    );
    const setPaymentInformationDone = useCallback(
        () => setCheckoutStep(CHECKOUT_STEP.REVIEW),
        [setCheckoutStep]
    );

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

        // Delete stale cart data from apollo
        await deleteCacheEntry(apolloClient, key => key.match(/^Cart/));

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

    const checkoutStep = (stepData && stepData.cart.checkoutStep) || 1;

    useEffect(() => {
        if (cartId) {
            getCheckoutStep({
                variables: {
                    cartId
                }
            });

            // And fetch any details for this page
            getCheckoutDetails({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, getCheckoutDetails, getCheckoutStep, setCheckoutStep]);

    return {
        checkoutStep,
        error: placeOrderError,
        handleSignIn,
        handlePlaceOrder,
        hasError: !!placeOrderError,
        isCartEmpty: !(checkoutData && checkoutData.cart.total_quantity),
        isGuestCheckout: !isSignedIn,
        isLoading: checkoutLoading,
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
        setPaymentInformationDone
    };
};
