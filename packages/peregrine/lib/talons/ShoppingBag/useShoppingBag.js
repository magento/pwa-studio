import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const useShoppingBag = props => {
    const { setIsOpen, queries } = props;
    const { ShoppingBagQuery } = queries;

    const [{ cartId }] = useCartContext();

    const { data, loading, error } = useQuery(ShoppingBagQuery, {
        fetchPolicy: 'cache-and-network',
        variables: { cartId },
        skip: !cartId
    });

    const totalQuantity = useMemo(() => {
        if (!loading && data) {
            return data.cart.total_quantity;
        }
    }, [data, loading]);

    const productListings = useMemo(() => {
        if (!loading && data) {
            return data.cart.items;
        }
    }, [data, loading]);

    const onDismiss = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return {
        onDismiss,
        loading,
        totalQuantity,
        productListings,
        error
    };
};
