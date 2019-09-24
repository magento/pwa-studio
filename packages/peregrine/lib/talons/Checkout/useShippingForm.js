import { useCallback } from 'react';
export const useShippingForm = props => {
    const {
        availableShippingMethods,
        isSubmitting,
        onCancel,
        onSubmit,
        shippingMethod
    } = props;

    let initialValue;
    let selectableShippingMethods;

    if (availableShippingMethods.length) {
        selectableShippingMethods = availableShippingMethods.map(
            ({ carrier_code, carrier_title }) => ({
                label: carrier_title,
                value: carrier_code
            })
        );
        initialValue =
            shippingMethod || availableShippingMethods[0].carrier_code;
    } else {
        selectableShippingMethods = [];
        initialValue = '';
    }

    const handleSubmit = useCallback(
        ({ shippingMethod }) => {
            const selectedShippingMethod = availableShippingMethods.find(
                ({ carrier_code }) => carrier_code === shippingMethod
            );

            if (!selectedShippingMethod) {
                console.warn(
                    `Could not find the selected shipping method ${selectedShippingMethod} in the list of available shipping methods.`
                );
                onCancel();
            } else {
                onSubmit({
                    shippingMethod: selectedShippingMethod
                });
            }
        },
        [availableShippingMethods, onCancel, onSubmit]
    );
    return {
        handleCancel: onCancel,
        handleSubmit,
        initialValue,
        isDisabled: isSubmitting,
        selectableShippingMethods
    };
};
