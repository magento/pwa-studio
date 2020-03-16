import { useCallback, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

export const useCartTrigger = props => {
    const {
        mutations: { createCartMutation },
        queries: { getCartDetailsQuery, getItemCountQuery }
    } = props;
    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }, { getCartDetails }] = useCartContext();

    const [getItemCount, { data }] = useLazyQuery(getItemCountQuery);
    const [fetchCartId] = useMutation(createCartMutation);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const itemCount = data ? data.cart.total_quantity : 0;

    useEffect(() => {
        getCartDetails({ fetchCartId, fetchCartDetails });
    }, [fetchCartDetails, fetchCartId, getCartDetails]);

    useEffect(() => {
        if (cartId) {
            getItemCount({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, getItemCount]);

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
