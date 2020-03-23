import { useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing',
    QUEUED: 'queued'
};

export const useShippingMethod = props => {
    const {
        doneEditing,
        showContent,
        queries: {
            getShippingMethods
        },
    } = props;

    const [{ cartId }] = useCartContext();

    const [fetchShippingMethods, { data, error, loading }] = useLazyQuery(
        getShippingMethods
    );

    // Fetch available shipping methods.
    useEffect(() => {
        if (cartId) {
            fetchShippingMethods({
                variables: { cartId }
            });
        }
    }, [cartId, fetchShippingMethods]);

    // Determine which state the display should be in.
    const displayState = useMemo(() => {
        if (!showContent) return displayStates.QUEUED;
        if (doneEditing) return displayStates.DONE;
        return displayStates.EDITING;
    }, [doneEditing, showContent]);

    // Determine the "primary" shipping address by using
    // the first shipping address on the cart.
    const primaryShippingAddress = useMemo(() => {
        const defaultValue = null;

        if (!data) return defaultValue;

        const shippingAddresses = data.cart.shipping_addresses;
        if (!shippingAddresses) return defaultValue;

        return shippingAddresses[0];
    }, [data]);

    // Grab the shipping methods from the primary shipping address.
    const shippingMethods = useMemo(() => {
        const defaultValue = [];

        if (!primaryShippingAddress) return defaultValue;

        return primaryShippingAddress.available_shipping_methods;
    }, [primaryShippingAddress]);

    // Grab the selected shipping method from the primary shipping address.
    const selectedShippingMethod = useMemo(() => {
        const defaultValue = null;

        if (!primaryShippingAddress) return defaultValue;

        let { selected_shipping_method: selectedMethod } = primaryShippingAddress;
        if (!selectedMethod) {
            // If there are shipping methods to choose from,
            // pick the lowest cost one from there instead.
            if (shippingMethods.length) {
                // Sort the shipping methods by price.
                const shippingMethodsByPrice = [...shippingMethods].sort(
                    (a, b) => a.amount.value - b.amount.value
                );

                // And then pick the lowest one.
                selectedMethod = shippingMethodsByPrice[0];
            }
        }

        const { carrier_code, method_code } = selectedMethod;
        return `${carrier_code}|${method_code}`;
    }, [primaryShippingAddress, shippingMethods]);

    return {
        didFailLoadingShippingMethods: error,
        displayState,
        isLoadingShippingMethods: loading,
        selectedShippingMethod,
        shippingMethods,
    };
};
