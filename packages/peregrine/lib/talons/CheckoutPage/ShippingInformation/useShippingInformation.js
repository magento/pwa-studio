import { useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';
import { MOCKED_ADDRESS } from '../../CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

export const useShippingInformation = props => {
    const {
        onSave,
        queries: { getShippingInformationQuery }
    } = props;

    const [{ cartId }] = useCartContext();

    const [fetchShippingInformation, { called, data, loading }] = useLazyQuery(
        getShippingInformationQuery
    );

    useEffect(() => {
        if (cartId) {
            fetchShippingInformation({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchShippingInformation]);

    const shippingData = useMemo(() => {
        let filteredData;
        if (data) {
            const { cart } = data;
            const { email, shipping_addresses: shippingAddresses } = cart;
            if (shippingAddresses.length) {
                const primaryAddress = shippingAddresses[0];
                for (const field in MOCKED_ADDRESS) {
                    if (primaryAddress[field] === MOCKED_ADDRESS[field]) {
                        primaryAddress[field] = '';
                    }

                    if (
                        field === 'street' &&
                        primaryAddress[field][0] === MOCKED_ADDRESS[field][0]
                    ) {
                        primaryAddress[field] = [''];
                    }
                }

                filteredData = {
                    email,
                    ...primaryAddress
                };
            }
        }

        return filteredData;
    }, [data]);

    const doneEditing = shippingData && shippingData.email;

    useEffect(() => {
        if (doneEditing) {
            onSave(doneEditing);
        }
    }, [doneEditing, onSave]);

    return {
        doneEditing,
        loading: !called || loading,
        shippingData
    };
};
