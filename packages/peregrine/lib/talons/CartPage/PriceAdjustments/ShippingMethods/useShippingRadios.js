import { useCallback, useEffect } from 'react';
import { useFieldApi } from 'informed';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useShippingRadios = props => {
    const {
        selectedShippingMethod,
        setShippingMethodMutation,
        shippingMethods
    } = props;
    const shippingMethodFieldApi = useFieldApi('method');
    const [setShippingMethod] = useMutation(setShippingMethodMutation);
    const [{ cartId }] = useCartContext();

    const formattedShippingMethods = shippingMethods.map(shippingMethod => ({
        ...shippingMethod,
        serializedValue: `${shippingMethod.carrier_code}|${
            shippingMethod.method_code
        }`
    }));

    useEffect(() => {
        const currentMethod = shippingMethodFieldApi.getValue();
        if (!currentMethod) {
            const defaultFirstMethod = formattedShippingMethods[0];
            if (defaultFirstMethod) {
                shippingMethodFieldApi.setValue(
                    defaultFirstMethod.serializedValue
                );
            }
        }
    }, [
        formattedShippingMethods,
        selectedShippingMethod,
        shippingMethodFieldApi
    ]);

    const handleShippingSelection = useCallback(
        value => {
            const [carrierCode, methodCode] = value.split('|');
            setShippingMethod({
                variables: {
                    cartId,
                    shippingMethod: {
                        carrier_code: carrierCode,
                        method_code: methodCode
                    }
                }
            });
        },
        [cartId, setShippingMethod]
    );

    return {
        formattedShippingMethods,
        handleShippingSelection
    };
};
