import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useProductListing = props => {
    const {
        queries: { GET_CART_IS_UPDATING, GET_PRODUCT_LISTING }
    } = props;

    const [{ cartId }] = useCartContext();
    const [activeEditItem, setActiveEditItem] = useState(null);

    const { client } = useQuery(GET_CART_IS_UPDATING);

    const setIsUpdating = useCallback(
        isUpdating => {
            client.writeData({ data: { cartIsUpdating: isUpdating } });
        },
        [client]
    );

    const [
        fetchProductListing,
        { called, data, error, loading }
    ] = useLazyQuery(GET_PRODUCT_LISTING, {
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
        setActiveEditItem,
        setIsUpdating
    };
};
