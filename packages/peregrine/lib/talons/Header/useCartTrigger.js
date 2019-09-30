import { useCallback, useEffect } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCartTrigger = () => {
    const [{ details }, { getCartDetails, toggleCart }] = useCartContext();
    const { items_qty: itemCount } = details;

    useEffect(() => {
        getCartDetails();
    }, [getCartDetails]);

    const handleClick = useCallback(() => {
        toggleCart();
    }, [toggleCart]);

    return {
        handleClick,
        itemCount
    };
};
