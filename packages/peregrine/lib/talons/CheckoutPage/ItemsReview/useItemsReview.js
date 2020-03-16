import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useItemsReview = props => {
    const [items, setItems] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);

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
            setItems(data.cart.items);
            setTotalQuantity(data.cart.total_quantity);
        }
    }, [data, called, loading, error, setItems]);

    return {
        isLoading: !!loading,
        items,
        totalQuantity
    };
};
