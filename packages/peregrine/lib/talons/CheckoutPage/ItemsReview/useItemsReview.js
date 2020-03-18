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

    const items = data ? data.cart.items : [];

    const totalQuantity = data ? +data.cart.total_quantity : 0;

    return {
        isLoading: !!loading,
        items: showAllItems ? items : items.slice(0, 2),
        hasErrors: !!error,
        totalQuantity,
        showAllItems,
        setShowAllItems: setShowAllItemsFlag
    };
};
