import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useProductListing = props => {
    const {
        queries: { getProductListing }
    } = props;

    const [{ cartId }] = useCartContext();
    const [activeEditItem, setActiveEditItem] = useState(null);

    const [
        fetchProductListing,
        { called, data, error, loading }
    ] = useLazyQuery(getProductListing, {
        // TODO: Purposely overfetch and hit the network until all components
        // are correctly updating the cache. Will be fixed by PWA-321.
        fetchPolicy: 'cache-and-network'
    });

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
        activeEditItem,
        isLoading: !!loading,
        items,
        setActiveEditItem
    };
};
