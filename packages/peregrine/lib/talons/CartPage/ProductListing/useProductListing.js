import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';
import { useEffect } from 'react';

export const useProductListing = props => {
    const { query } = props;

    const [{ cartId }] = useCartContext();

    const [
        fetchProductListing,
        { called, data, error, loading }
    ] = useLazyQuery(query);

    useEffect(() => {
        if (cartId) {
            fetchProductListing({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchProductListing]);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    let items = [];
    if (called && !error && !loading) {
        items = data.cart.items;
    }

    return {
        isLoading: !!loading,
        items
    };
};
