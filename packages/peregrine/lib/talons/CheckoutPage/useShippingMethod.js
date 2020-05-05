import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing'
};

export const serializeShippingMethod = method => {
    if (!method) return null;

    const { carrier_code, method_code } = method;

    return `${carrier_code}|${method_code}`;
};

const deserializeShippingMethod = serializedValue => {
    return serializedValue.split('|');
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
     *  Member Variables.
     */
    // If we don't have a selected shipping method then assume we're editing, not done.
    const [displayState, setDisplayState] = useState(displayStates.EDITING);
    const [updateFormApi, setUpdateFormApi] = useState();
    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
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

    useEffect(() => {
        if (!data) return;

        // Sorts available shipping methods by price.
        const byPrice = (a, b) => a.amount.value - b.amount.value;

        // Adds a serialized property to available shipping method objects
        // so they can be selected in the radio group.
        const addSerializedProperty = shippingMethod => {
            const serializedValue = serializeShippingMethod(shippingMethod);

            return {
                ...shippingMethod,
                serializedValue
            };
        };

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
        // If we don't have one, default to the lowest cost shipping method instead.
        const selectedMethod = primaryShippingAddress.selected_shipping_method;
        setSelectedShippingMethod(selectedMethod);

        // If we have data  we should tell the checkout page
        // so that we set the next step correctly.
        if (selectedMethod) {
            onSave();
        }

        // Determine the component's display state.
        const nextDisplayState = selectedMethod
            ? displayStates.DONE
            : displayStates.EDITING;
        setDisplayState(nextDisplayState);

        // Sometimes the update form will mount before we have a selected
        // shipping method to put in its initialValues.
        // When that happens, use the form's api to update the field value.
        if (updateFormApi && selectedMethod) {
            updateFormApi.setValues({
                shipping_method: serializeShippingMethod(selectedMethod)
            });
        }
    }, [data, onSave, updateFormApi]);

    return {
        displayState,
        handleCancelUpdate: closeDrawer,
        handleSubmit,
        isLoading: loading,
        isUpdateMode: drawer === DRAWER_NAME,
        selectedShippingMethod,
        setUpdateFormApi,
        shippingMethods,
        showUpdateMode
    };
};
