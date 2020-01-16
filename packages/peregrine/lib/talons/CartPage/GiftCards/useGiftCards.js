import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useGiftCards = props => {
    const { cartQuery } = props;

    const [{ cartId }] = useCartContext();

    const { data, error, loading } = useQuery(cartQuery, {
        variables: cartId
    });

    return {
        data,
        error,
        loading
    };
};
