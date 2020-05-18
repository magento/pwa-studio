import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';

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

export const useShippingMethod = props => {
    const {
        onSave,
        mutations: { setShippingMethod },
        queries: { getSelectedAndAvailableShippingMethods },
        setPageIsUpdating
    } = props;

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

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
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isBackgroundAutoSelecting, setIsBackgroundAutoSelecting] = useState(
        false
    );

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
            setIsUpdateMode(false);
            setDisplayState(displayStates.DONE);
        },
        [
            cartId,
            setDisplayState,
            setIsUpdateMode,
            setPageIsUpdating,
            setShippingMethodCall
        ]
    );

    const handleCancelUpdate = useCallback(() => {
        setIsUpdateMode(false);
    }, []);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);
    }, []);

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

    // If an authenticated user does not have a preferred shipping method,
    // auto-select the least expensive one for them.
    useEffect(() => {
        if (!data) return;
        if (!cartId) return;
        if (!isSignedIn) return;

        // Functions passed to useEffect should be synchronous.
        // Set this helper function up as async so we can wait on the mutation
        // before re-querying.
        const autoSelectShippingMethod = async shippingMethod => {
            const { carrier_code, method_code } = shippingMethod;

            setIsBackgroundAutoSelecting(true);

            // Perform the operation on the backend.
            await setShippingMethodCall({
                variables: {
                    cartId,
                    shippingMethod: {
                        carrier_code,
                        method_code
                    }
                }
            });

            setIsBackgroundAutoSelecting(false);

            // And re-fetch our data so that our other effects fire (if necessary).
            fetchShippingMethodInfo({
                variables: { cartId }
            });
        };

        const primaryAddress = data.cart.shipping_addresses[0];
        const userShippingMethod = primaryAddress.selected_shipping_method;
        if (!userShippingMethod) {
            // Sort the shipping methods by price.
            const allShippingMethods =
                primaryAddress.available_shipping_methods;
            const shippingMethodsByPrice = [...allShippingMethods].sort(
                byPrice
            );
            const leastExpensiveShippingMethod = shippingMethodsByPrice[0];

            if (leastExpensiveShippingMethod) {
                autoSelectShippingMethod(leastExpensiveShippingMethod);
            }
        }
    }, [
        cartId,
        data,
        fetchShippingMethodInfo,
        isSignedIn,
        setShippingMethodCall
    ]);

    return {
        displayState,
        handleCancelUpdate,
        handleSubmit,
        isLoading: loading || isBackgroundAutoSelecting,
        isUpdateMode,
        selectedShippingMethod,
        shippingMethods,
        showUpdateMode
    };
};
