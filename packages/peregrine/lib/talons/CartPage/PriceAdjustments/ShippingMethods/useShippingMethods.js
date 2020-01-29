import { useEffect, useState } from 'react';
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

    const [isFetchingMethods, setIsFetchingMethods] = useState(false);

    let formattedShippingMethods = [];
    let selectedShippingMethod = null;
    let selectedShippingFields = {
        country: 'US',
        state: '',
        zip: ''
    };
    if (called && !loading && !error) {
        const { cart } = data;
        const { shipping_addresses: shippingAddresses } = cart;
        if (shippingAddresses.length) {
            const primaryShippingAddress = shippingAddresses[0];
            const {
                available_shipping_methods: shippingMethods,
                country,
                postcode,
                region,
                selected_shipping_method: shippingMethod
            } = primaryShippingAddress;

            selectedShippingFields = {
                country: country.code,
                state: region.code,
                zip: postcode
            };
            formattedShippingMethods = shippingMethods;

            if (shippingMethod) {
                selectedShippingMethod = `${shippingMethod.carrier_code}|${
                    shippingMethod.method_code
                }`;
            }
        }
    }

    return {
        isFetchingMethods,
        isLoading: called && loading,
        selectedShippingFields,
        selectedShippingMethod,
        setIsFetchingMethods,
        shippingMethods: formattedShippingMethods
    };
};
