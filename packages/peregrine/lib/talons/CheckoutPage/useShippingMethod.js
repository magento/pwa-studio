import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing'
};

const serializeShippingMethod = method => {
    if (!method) return '';

    const { carrier_code, method_code } = method;

    return `${carrier_code}|${method_code}`;
};

const deserializeShippingMethod = serializedValue => {
    return serializedValue.split('|');
};

// Sorts available shipping methods by price.
const byPrice = (a, b) => a.amount.value - b.amount.value;

// Adds a serialized property to shipping method objects
// so they can be selected in the radio group.
const addSerializedProperty = shippingMethod => {
    if (!shippingMethod) return shippingMethod;

    const serializedValue = serializeShippingMethod(shippingMethod);

    return {
        ...shippingMethod,
        serializedValue
    };
};

const DRAWER_NAME = 'checkout.shippingMethod.update';

export const useShippingMethod = props => {
    const {
        onSave,
        mutations: { setShippingMethod },
        queries: { getSelectedAndAvailableShippingMethods },
        setPageIsUpdating
    } = props;

    const [{ drawer }, { closeDrawer, toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();

    /*
     *  Apollo Hooks.
     */
    const [setShippingMethodCall] = useMutation(setShippingMethod);

    const [fetchShippingMethodInfo, { data, loading }] = useLazyQuery(
        getSelectedAndAvailableShippingMethods,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    /*
     *  State / Derived state.
     */
    const [displayState, setDisplayState] = useState(displayStates.EDITING);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
    const hasData =
        data &&
        data.cart.shipping_addresses.length &&
        data.cart.shipping_addresses[0].selected_shipping_method;

    /*
     *  Callbacks.
     */
    const handleSubmit = useCallback(
        async value => {
            const [carrierCode, methodCode] = deserializeShippingMethod(
                value.shipping_method
            );

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
        },
        [
            cartId,
            closeDrawer,
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
    // Issue the query only if we have a cartId.
    useEffect(() => {
        if (cartId) {
            fetchShippingMethodInfo({
                variables: { cartId }
            });
        }
    }, [cartId, fetchShippingMethodInfo]);

    // When we have data we should tell the checkout page
    // so that it can set the step correctly.
    useEffect(() => {
        if (hasData) {
            onSave();
        }
    }, [hasData, onSave]);

    useEffect(() => {
        if (!data) return;

        // Determine the "primary" shipping address by using
        // the first shipping address on the cart.
        const primaryShippingAddress = data.cart.shipping_addresses[0];

        // Shape the list of available shipping methods.
        // Sort them by price and add a serialized property to each.
        const rawShippingMethods =
            primaryShippingAddress.available_shipping_methods;
        const shippingMethodsByPrice = [...rawShippingMethods].sort(byPrice);
        const shippingMethods = shippingMethodsByPrice.map(
            addSerializedProperty
        );
        setShippingMethods(shippingMethods);

        // Determine the selected shipping method.
        const selectedMethod = addSerializedProperty(
            primaryShippingAddress.selected_shipping_method
        );
        setSelectedShippingMethod(selectedMethod);

        // Determine the component's display state.
        const nextDisplayState = selectedMethod
            ? displayStates.DONE
            : displayStates.EDITING;
        setDisplayState(nextDisplayState);
    }, [data]);

    return {
        displayState,
        handleCancelUpdate: closeDrawer,
        handleSubmit,
        isLoading: loading,
        isUpdateMode: drawer === DRAWER_NAME,
        selectedShippingMethod,
        shippingMethods,
        showUpdateMode
    };
};
