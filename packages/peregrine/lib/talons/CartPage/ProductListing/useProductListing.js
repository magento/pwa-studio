import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';
import { useEffect } from 'react';

export const useProductListing = props => {
    const { query } = props;

    const [{ cartId }] = useCartContext();

    const { data, error, loading } = useQuery(query, {
        variables: { cartId },
        // TODO: Purposely overfetch and hit the network until all components
        // are correctly updating the cache. Will be fixed by PWA-321.
        fetchPolicy: 'cache-and-network'
    });

    let items = [];
    if (!error && !loading) {
        items = data.cart.items;
    }

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    return {
        isLoading: !!loading,
        items
    };
};
