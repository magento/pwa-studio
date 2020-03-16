import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useItemsReview = props => {
    const [items, setItems] = useState([]);

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
        }
    }, [error]);

    useEffect(() => {
        if (called && !error && !loading) {
            setItems(data.cart.items);
        }
    }, [data, called, loading, error, setItems]);

    return {
        isLoading: !!loading,
        items
    };
};
