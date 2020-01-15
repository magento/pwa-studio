import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';
import { useEffect } from 'react';

export const useProductListing = props => {
    const { query } = props;

    const [{ cartId }] = useCartContext();

    const { data, error, loading } = useQuery(query, {
        variables: { cartId }
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
