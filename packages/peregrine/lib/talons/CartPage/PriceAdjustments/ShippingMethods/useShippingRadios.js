import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useShippingRadios = props => {
    const { setShippingMethodMutation } = props;
    const [setShippingMethod] = useMutation(setShippingMethodMutation);
    const [{ cartId }] = useCartContext();

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
        handleShippingSelection
    };
};
