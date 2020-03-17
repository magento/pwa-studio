import { useEffect, useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useItemsReview = props => {
    const [items, setItems] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [showAllItems, setShowAllItems] = useState(false);

    const {
        queries: { getItemsInCart }
    } = props;

    const [{ cartId }] = useCartContext();

    const [fetchItemsInCart, { called, data, error, loading }] = useLazyQuery(
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
            setItems([]);
            setTotalQuantity(0);
        }
    }, [error]);

    useEffect(() => {
        if (called && !error && !loading) {
            /**
             * if for some reason items turns out to be
             * null set items to []
             */
            setItems(data.cart.items || []);
            /**
             * if total_quantity turns out to be null
             * + will convert it to 0
             */
            setTotalQuantity(+data.cart.total_quantity);
        }
    }, [data, called, loading, error, setItems]);

    return {
        isLoading: !!loading,
        items: showAllItems ? items : items.slice(0, 2),
        setItems,
        totalQuantity,
        showAllItems,
        setShowAllItems: setShowAllItemsFlag
    };
};
