import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';

export const useCheckoutPage = props => {
    const {
        mutations: { createCartMutation },
        queries: { getCheckoutDetailsQuery }
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();

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

    /**
     * Using local state to maintain these booleans. Can be
     * moved to checkout context in the future if needed.
     *
     * These are needed to track progree of checkout steps.
     */
    const [shippingInformationDone, updateShippingInformationDone] = useState(
        false
    );
    const [shippingMethodDone, updateShippingMethodDone] = useState(false);
    const [paymentInformationDone, updatePaymentInformationDone] = useState(
        false
    );
    const [orderPlaced, updateOrderPlaced] = useState(false);

    const setShippingInformationDone = useCallback(
        () => updateShippingInformationDone(true),
        [updateShippingInformationDone]
    );
    const setShippingMethodDone = useCallback(
        () => updateShippingMethodDone(true),
        [updateShippingMethodDone]
    );
    const setPaymentInformationDone = useCallback(
        () => updatePaymentInformationDone(true),
        [updatePaymentInformationDone]
    );
    const placeOrder = useCallback(async () => {
        await submitOrder();
        updateOrderPlaced(true);
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
        shippingInformationDone,
        shippingMethodDone,
        paymentInformationDone,
        orderPlaced,
        handleSignIn,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        placeOrder
    };
};
