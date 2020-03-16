import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4,
    RECEIPT: 5
};

export const useCheckoutPage = props => {
    const {
        mutations: {
            createCartMutation
            // setCheckoutStep
        },
        queries: { getCheckoutDetailsQuery }
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();

    // const [setCheckoutStepMutation] = useMutation(setCheckoutStep);
    const [checkoutStep, setCheckoutStep] = useState(
        CHECKOUT_STEP.SHIPPING_ADDRESS
    );
    const [fetchCartId] = useMutation(createCartMutation);
    const [
        getCheckoutDetails,
        { data: cartData, loading: cartLoading }
    ] = useLazyQuery(getCheckoutDetailsQuery, {
        // TODO: Purposely overfetch and hit the network until all components
        // are correctly updating the cache. Will be fixed by PWA-321.
        fetchPolicy: 'cache-and-network'
    });

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    /**
     * TODO. This needs to change to checkout mutations
     * or other mutations once we start checkout development.
     *
     * For now we will be using removeCart and createCart to
     * simulate a cart clear on Place Order button click.
     */
    const submitOrder = useCallback(async () => {
        // TODO: implement and use submitOrder()

        // TODO: Convert remove/createCart to a new "reset/create" mutation.
        await removeCart();
        await createCart({
            fetchCartId
        });
    }, [createCart, fetchCartId, removeCart]);

    const setShippingInformationDone = useCallback(
        () => setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD),
        []
    );
    const setShippingMethodDone = useCallback(
        () => setCheckoutStep(CHECKOUT_STEP.PAYMENT),
        []
    );
    const setPaymentInformationDone = useCallback(
        () => setCheckoutStep(CHECKOUT_STEP.REVIEW),
        []
    );
    const placeOrder = useCallback(async () => {
        await submitOrder();
        setCheckoutStep(CHECKOUT_STEP.RECEIPT);
    }, [submitOrder]);

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
        isGuestCheckout: !isSignedIn,
        isCartEmpty: !(cartData && cartData.cart.total_quantity),
        isLoading: cartLoading,
        checkoutStep,
        handleSignIn,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        placeOrder
    };
};
