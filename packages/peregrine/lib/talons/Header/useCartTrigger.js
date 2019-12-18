import { useCallback } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useCartTrigger = () => {
    const [, { toggleDrawer }] = useAppContext();
    const [{ derivedDetails }] = useCartContext();
    const { numItems: itemCount } = derivedDetails;

    const handleClick = useCallback(async () => {
        toggleDrawer('cart');
    }, [toggleDrawer]);

    return {
        handleClick,
        itemCount
    };
};
