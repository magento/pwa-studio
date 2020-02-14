import { useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

export const useCartTrigger = props => {
    const { createCartMutation, getCartDetailsQuery } = props;
    const [, { toggleDrawer }] = useAppContext();
    const [{ derivedDetails }, { getCartDetails }] = useCartContext();
    const { numItems: itemCount } = derivedDetails;

    const [fetchCartId] = useMutation(createCartMutation);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    useEffect(() => {
        getCartDetails({
            fetchCartId,
            fetchCartDetails
        });
    }, [fetchCartDetails, fetchCartId, getCartDetails]);

    const handleClick = useCallback(async () => {
        toggleDrawer('cart');
        await getCartDetails({
            fetchCartId,
            fetchCartDetails
        });
    }, [fetchCartDetails, fetchCartId, getCartDetails, toggleDrawer]);

    return {
        handleClick,
        itemCount
    };
};
