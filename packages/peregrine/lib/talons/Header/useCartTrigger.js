import { useCallback, useMemo } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCartTrigger = () => {
    const [{ details }, { toggleCart }] = useCartContext();

    // TODO: Update the effect to use graphql and update store with item quantity on mount. Do this when converting getCartDetails to graphql.
    // useEffect(() => {
    //     getCartDetails();
    // }, [getCartDetails]);

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
