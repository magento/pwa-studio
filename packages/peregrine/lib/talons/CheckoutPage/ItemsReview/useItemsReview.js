import { useEffect, useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useItemsReview = props => {
    const [showAllItems, setShowAllItems] = useState(false);

    const {
        queries: { getItemsInCart }
    } = props;

    const [{ cartId }] = useCartContext();

    const [fetchItemsInCart, { data, error, loading }] = useLazyQuery(
        getItemsInCart,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const setShowAllItemsFlag = useCallback(() => setShowAllItems(true), [
        setShowAllItems
    ]);

    useEffect(() => {
        if (cartId) {
            fetchItemsInCart({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchItemsInCart]);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    useEffect(() => {
        /**
         * If there are 2 or less than 2 items in cart
         * set show all items to `true`.
         */
        if (data && data.cart && data.cart.items.length <= 2) {
            setShowAllItems(true);
        }
    }, [data]);

    const items = data ? data.cart.items : [];

    const totalQuantity = data ? +data.cart.total_quantity : 0;

    return {
        isLoading: !!loading,
        items,
        hasErrors: !!error,
        totalQuantity,
        showAllItems,
        setShowAllItems: setShowAllItemsFlag
    };
};
