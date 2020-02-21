import { useCallback, useState } from 'react';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';

export const useCheckoutPage = () => {
    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ isEmpty }] = useCartContext();

    /**
     * Using local state to maintain these booleans. Can be
     * moved to checkout context in the future if needed.
     */
    const [shippingInformationDone, updateShippingInformationDone] = useState(
        false
    );
    const [shippingMethodDone, updateShippingMethodDone] = useState(false);
    const [paymentInformationDone, updatePaymentInformationDone] = useState(
        false
    );
    const [orderPlaced, updateOrderPlaced] = useState(false);

    const handleSignIn = useCallback(() => {
        toggleDrawer('nav');
    }, [toggleDrawer]);

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

    const placeOrder = useCallback(() => {
        updateOrderPlaced(true);
    }, [updateOrderPlaced]);

    return [
        {
            isGuestCheckout: !isSignedIn,
            isCartEmpty: isEmpty,
            shippingInformationDone,
            shippingMethodDone,
            paymentInformationDone,
            orderPlaced
        },
        {
            handleSignIn,
            setShippingInformationDone,
            setShippingMethodDone,
            setPaymentInformationDone,
            placeOrder
        }
    ];
};
