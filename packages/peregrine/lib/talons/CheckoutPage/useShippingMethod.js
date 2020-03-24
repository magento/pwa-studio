import { useCallback, useEffect, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing',
    QUEUED: 'queued'
};

export const useShippingMethod = props => {
    const {
        doneEditing,
        onSave,
        showContent,
        queries: {
            getShippingMethods
        },
        mutations: {
            setShippingMethod
        }
    } = props;

    const [{ cartId }] = useCartContext();

    /*
     *  Apollo Hooks.
     */
    const [fetchShippingMethods, { data, error, loading }] = useLazyQuery(
        getShippingMethods
    );
    const [setShippingMethodCall] = useMutation(setShippingMethod);

    /*
     *  Member Variables.
     */
    // Determine which state the component should be in.
    const displayState = useMemo(() => {
        if (!showContent) return displayStates.QUEUED;
        if (doneEditing) return displayStates.DONE;
        return displayStates.EDITING;
    }, [doneEditing, showContent]);

    // Determine the "primary" shipping address by using
    // the first shipping address on the cart.
    const primaryShippingAddress = useMemo(() => {
        try {
            return data.cart.shipping_addresses[0];
        }
        catch {
            return null;
        }
    }, [data]);

    // Grab the shipping methods from the primary shipping address.
    const shippingMethods = useMemo(() => {
        try {
            const shippingMethods = primaryShippingAddress.available_shipping_methods;

            // Add a serialized property to the shipping methods.
            return shippingMethods.map(shippingMethod => {
                const { carrier_code, method_code } = shippingMethod;
    
                return {
                    ...shippingMethod,
                    serializedValue: `${carrier_code}|${method_code}`
                };
            });
        }
        catch {
            return [];
        }
    }, [primaryShippingAddress]);

    // Grab the selected shipping method from the primary shipping address.
    const selectedShippingMethod = useMemo(() => {
        try {
            let selectedMethod = primaryShippingAddress.selected_shipping_method;

            if (!selectedMethod) {
                // If there are shipping methods to choose from,
                // pick the lowest cost one from there instead.
                if (shippingMethods.length) {
                    // Sort the shipping methods by price.
                    const shippingMethodsByPrice = [...shippingMethods].sort(
                        (a, b) => a.amount.value - b.amount.value
                    );
    
                    // Pick the lowest one.
                    selectedMethod = shippingMethodsByPrice[0];
                }
            }
    
            const { carrier_code, method_code } = selectedMethod;
            return `${carrier_code}|${method_code}`;
        } catch {
            return null;
        }
    }, [primaryShippingAddress, shippingMethods]);

    /*
     *  Callbacks.
     */
    const handleSubmit = useCallback(
        async value => {
            const [carrierCode, methodCode] = value.shipping_method.split('|');
            await setShippingMethodCall({
                variables: {
                    cartId,
                    shippingMethod: {
                        carrier_code: carrierCode,
                        method_code: methodCode
                    }
                }
            });

            if (onSave) onSave();
        },
        [cartId, onSave, setShippingMethodCall]
    );

    /*
     *  Effects.
     */
    // Fetch available shipping methods.
    useEffect(() => {
        if (cartId) {
            fetchShippingMethods({
                variables: { cartId }
            });
        }
    }, [cartId, fetchShippingMethods]);

    return {
        displayState,
        handleSubmit,
        hasShippingMethods: !error && shippingMethods.length,
        isLoadingShippingMethods: loading,
        selectedShippingMethod,
        shippingMethods,
    };
};
