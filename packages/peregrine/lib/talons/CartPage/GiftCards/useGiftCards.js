import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useGiftCards = props => {
    const { cartQuery } = props;

    const [{ cartId }] = useCartContext();

    console.log('cartId is', cartId);

    // const { data, error, loading } = useQuery(cartQuery, {
    //     variables: { cartId }
    // });

    const data = {};
    const error = null;
    const loading = false;

    return {
        data,
        error,
        loading
    };
};
