import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useShippingMethods = props => {
    const { getShippingMethodsQuery } = props;
    const [{ cartId }] = useCartContext();
    const [
        fetchShippingMethods,
        { called, data, error, loading }
    ] = useLazyQuery(getShippingMethodsQuery, {
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (cartId) {
            fetchShippingMethods({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchShippingMethods]);

    let formattedShippingMethods = [];
    if (called && !loading && !error) {
        const { cart } = data;
        const { shipping_addresses: shippingAddresses } = cart;
        if (shippingAddresses.length) {
            const primaryShippingAddress = shippingAddresses.shift();
            formattedShippingMethods =
                primaryShippingAddress.available_shipping_methods;
        }
    }

    const handleSubmit = useCallback(event => {
        console.log(event);
    }, []);

    return {
        shippingMethods: formattedShippingMethods,
        handleSubmit
    };
};
