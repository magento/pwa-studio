import { useCallback, useEffect, useMemo } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCartTrigger = () => {
    const [
        { cartId, details },
        { getCartDetails, toggleCart }
    ] = useCartContext();

    // Whenever we get a new, valid cartId we should refetch details.
    useEffect(() => {
        if (cartId) {
            getCartDetails();
        }
    }, [cartId, getCartDetails]);

    const itemCount = useMemo(() => {
        return details.items_qty || 0;
    }, [details]);

    const handleClick = useCallback(() => {
        toggleCart();
    }, [toggleCart]);

    return {
        handleClick,
        itemCount
    };
};
