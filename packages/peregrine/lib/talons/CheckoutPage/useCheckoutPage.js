import { useCallback, useState } from 'react';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';

export const useCheckoutPage = () => {
    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ isEmpty }] = useCartContext();
    const [shippingInformationDone, setShippingInformationDone] = useState(
        false
    );
    const [shippingMethodDone, setShippingMethodDone] = useState(false);

    const handleSignIn = useCallback(() => {
        toggleDrawer('nav');
    }, [toggleDrawer]);

    return [
        {
            isGuestCheckout: !isSignedIn,
            isCartEmpty: isEmpty,
            shippingInformationDone,
            shippingMethodDone
        },
        {
            handleSignIn,
            setShippingInformationDone,
            setShippingMethodDone
        }
    ];
};
