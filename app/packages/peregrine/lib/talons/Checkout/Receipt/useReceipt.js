import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useReceipt = props => {
    const { onClose } = props;

    const [{ drawer }] = useAppContext();
    const [, { createAccount, resetReceipt }] = useCheckoutContext();
    const [{ isSignedIn }] = useUserContext();
    const history = useHistory();

    // When the drawer is closed reset the state of the receipt. We use a ref
    // because drawer can change if the mask is clicked. Mask updates drawer.
    const prevDrawer = useRef(null);
    useEffect(() => {
        if (prevDrawer.current === 'cart' && drawer !== 'cart') {
            resetReceipt();
            onClose();
        }
        prevDrawer.current = drawer;
    }, [drawer, onClose, resetReceipt]);

    const handleCreateAccount = useCallback(() => {
        createAccount({
            history
        });
    }, [createAccount, history]);

    const handleViewOrderDetails = useCallback(() => {
        // TODO: Implement/connect/redirect to order details page.
    }, []);

    return {
        handleCreateAccount,
        handleViewOrderDetails,
        isSignedIn
    };
};
