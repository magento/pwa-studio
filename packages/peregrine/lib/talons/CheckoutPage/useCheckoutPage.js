import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useAwaitQuery } from '../../hooks/useAwaitQuery';
import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';

export const useCheckoutPage = props => {
    const { createCartMutation, getCartDetailsQuery } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [
        { isEmpty },
        { createCart, getCartDetails, removeCart }
    ] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const handleSignIn = useCallback(() => {
        toggleDrawer('nav');
    }, [toggleDrawer]);

    /**
     * TODO. This needs to change to checkout mutations
     * or other mutations once we start checkout development.
     *
     * For now we will be using removeCart and createCart to
     * simulate a cart clear on Place Order button click.
     */
    const cleanUpCart = useCallback(async () => {
        await removeCart();

        await createCart({
            fetchCartId
        });

        await getCartDetails({ fetchCartId, fetchCartDetails });
    }, [removeCart, createCart, getCartDetails, fetchCartId, fetchCartDetails]);

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
        await cleanUpCart();
        updateOrderPlaced(true);
    }, [cleanUpCart, updateOrderPlaced]);

    return {
        isGuestCheckout: !isSignedIn,
        isCartEmpty: isEmpty,
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
