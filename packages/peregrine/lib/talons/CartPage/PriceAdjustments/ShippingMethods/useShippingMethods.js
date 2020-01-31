import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useShippingMethods = props => {
    const { getShippingMethodsQuery } = props;
    const [{ cartId }] = useCartContext();
    const [fetchShippingMethods, { data }] = useLazyQuery(
        getShippingMethodsQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const [isShowingForm, setIsShowingForm] = useState(false);

    useEffect(() => {
        if (cartId) {
            fetchShippingMethods({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchShippingMethods]);

    useEffect(() => {
        if (
            data &&
            data.cart &&
            data.cart.shipping_addresses &&
            data.cart.shipping_addresses.length
        ) {
            setIsShowingForm(true);
        }
    }, [data]);

    let formattedShippingMethods = [];
    let selectedShippingMethod = null;
    let selectedShippingFields = {
        country: 'US',
        state: '',
        zip: ''
    };
    if (data) {
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
        hasMethods: formattedShippingMethods.length,
        isShowingForm,
        selectedShippingFields,
        selectedShippingMethod,
        setIsShowingForm,
        shippingMethods: formattedShippingMethods
    };
};
