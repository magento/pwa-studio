import { useCallback, useEffect, useMemo } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCartTrigger = () => {
    const [
        { cartId, details, isLoading },
        { getCartDetails, toggleCart }
    ] = useCartContext();

    // If we have a cartId but we haven't gotten details yet and we're not in
    // the middle of fetching the details, we should go get em.
    useEffect(() => {
        if (cartId && typeof details.items_qty === 'undefined' && !isLoading) {
            getCartDetails();
        }
    }, [cartId, details.items_qty, getCartDetails, isLoading]);

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
