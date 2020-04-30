import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing'
};

const DRAWER_NAME = 'checkout.shippingMethod.update';

export const useShippingMethod = props => {
    const {
        onSave,
        mutations: { setShippingMethod },
        queries: { getShippingMethods, getSelectedShippingMethod },
        setPageIsUpdating
    } = props;

    const [{ drawer }, { closeDrawer, toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();

    /*
     *  Apollo Hooks.
     */
    const [setShippingMethodCall] = useMutation(setShippingMethod);
    const [
        fetchSelectedShippingMethod,
        {
            data: chosenShippingMethodData,
            loading: isLoadingSelectedShippingMethod
        }
    ] = useLazyQuery(getSelectedShippingMethod, {
        fetchPolicy: 'cache-and-network'
    });
    const [
        fetchShippingMethods,
        { data, loading: isLoadingShippingMethods }
    ] = useLazyQuery(getShippingMethods, { fetchPolicy: 'cache-and-network' });

    /*
     *  Member Variables.
     */
    // If we don't have a selected shipping method then assume we're editing, not done.
    const [displayState, setDisplayState] = useState(displayStates.EDITING);

    // Determine the "primary" shipping address by using
    // the first shipping address on the cart.
    const primaryShippingAddress = useMemo(() => {
        try {
            return data.cart.shipping_addresses[0];
        } catch {
            return null;
        }
    }, [data]);

    // Grab the shipping methods from the primary shipping address.
    const shippingMethods = useMemo(() => {
        try {
            const shippingMethods =
                primaryShippingAddress.available_shipping_methods;

            // Sort the shipping methods by price.
            const shippingMethodsByPrice = [...shippingMethods].sort(
                (a, b) => a.amount.value - b.amount.value
            );

            // Add a serialized property to the shipping methods.
            return shippingMethodsByPrice.map(shippingMethod => {
                const { carrier_code, method_code } = shippingMethod;

                return {
                    ...shippingMethod,
                    serializedValue: `${carrier_code}|${method_code}`
                };
            });
        } catch {
            return [];
        }
    }, [primaryShippingAddress]);

    // Grab the selected shipping method. In order:
    // 1. From the results of our specific query to fetch it
    // 2. From the primary shipping address
    // 3. The lowest cost shipping method
    const selectedShippingMethodObject = useMemo(() => {
        let selectedMethod;

        // From the results of our specific query to fetch it.
        try {
            selectedMethod = chosenShippingMethodData.cart.shipping_addresses[0].selected_shipping_method;
            console.log('selected method from query', selectedMethod); // carrier_code and method_code
        }
        catch (err) {
            // We don't have data from our specific query to fetch the selected shipping method.
            // Intentionally swallow this error.
        }

        if (!selectedMethod) {
            // From the primary shipping address.
            try {
                selectedMethod = primaryShippingAddress.selected_shipping_method;
                console.log('selected method from primary address', selectedMethod);
            }
            catch (err) {
                // We don't have a selected shipping method for the primary shipping address.
                // Intentionally swallow this error.
            }
        }

        if (!selectedMethod) {
            // From the lowest cost shipping method.
            if (shippingMethods.length) {
                // We sorted the shipping methods by price,
                // so the first one is the lowest cost one.
                selectedMethod = shippingMethods[0];
                console.log('selected method from list of methods', selectedMethod); // has all display data needed
            }
        }

        return selectedMethod || null;
    }, [chosenShippingMethodData, primaryShippingAddress, shippingMethods]);

    const selectedShippingMethod = useMemo(() => {
        if (selectedShippingMethodObject) {
            const { carrier_code, method_code } = selectedShippingMethodObject;
            return `${carrier_code}|${method_code}`;
        }
    }, [selectedShippingMethodObject]);

    /*
     *  Callbacks.
     */
    const handleSubmit = useCallback(
        async value => {
            const [carrierCode, methodCode] = value.shipping_method.split('|');

            setPageIsUpdating(true);

            await setShippingMethodCall({
                variables: {
                    cartId,
                    shippingMethod: {
                        carrier_code: carrierCode,
                        method_code: methodCode
                    }
                }
            });

            setPageIsUpdating(false);
            setDisplayState(displayStates.DONE);
            closeDrawer();
            onSave();
        },
        [
            cartId,
            closeDrawer,
            onSave,
            setDisplayState,
            setPageIsUpdating,
            setShippingMethodCall
        ]
    );

    const showUpdateMode = useCallback(() => {
        toggleDrawer(DRAWER_NAME);
    }, [toggleDrawer]);

    /*
     *  Effects.
     */
    useEffect(() => {
        if (cartId) {
            fetchShippingMethods({
                variables: { cartId }
            });
        }
    }, [cartId, fetchShippingMethods]);

    useEffect(() => {
        if (cartId) {
            fetchSelectedShippingMethod({
                variables: { cartId }
            });
        }
    }, [cartId, fetchSelectedShippingMethod]);

    useEffect(() => {
        try {
            const chosenShippingMethod =
                chosenShippingMethodData.cart.shipping_addresses[0]
                    .selected_shipping_method;
            
            console.log('useShippingMethod: we have a selected method');

            const nextDisplayState = chosenShippingMethod
                ? displayStates.DONE
                : displayStates.EDITING;

            setDisplayState(nextDisplayState);
        } catch {
            setDisplayState(displayStates.EDITING);
        }
    }, [chosenShippingMethodData]);

    // console.log('useShippingMethod');
    // console.log('fetched shipping methods:', data);
    // console.log('fetched selected method', chosenShippingMethodData);

    return {
        displayState,
        handleCancelUpdate: closeDrawer,
        handleSubmit,
        isLoadingSelectedShippingMethod:
            isLoadingSelectedShippingMethod === true,
        isLoadingShippingMethods: isLoadingShippingMethods === true,
        isUpdateMode: drawer === DRAWER_NAME,
        selectedShippingMethod,
        selectedShippingMethodObject,
        shippingMethods,
        showUpdateMode
    };
};
