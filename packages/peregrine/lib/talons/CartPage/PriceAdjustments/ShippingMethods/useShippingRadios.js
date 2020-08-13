import { useCallback, useEffect } from 'react';
import { useFieldApi } from 'informed';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

/**
 * Contains logic for a Shipping Radios component.
 * It returns props data used for rendering that component.
 * 
 * @function
 * 
 * @param {Object} props 
 * @param {Function} props.setIsCartUpdating Function for setting the updating state of the shopping cart
 * @param {String} props.selectedShippingMethod The carrier code or method code for the selected shipping method
 * @param {Array<Object>} props.shippingMethods An array of available shipping methods
 * @param {ShippingRadiosMutations} props.mutations GraphQL mutations for Shipping Radios
 * 
 * @return {ShippingRadiosProps}
 */
export const useShippingRadios = props => {
    const {
        setIsCartUpdating,
        selectedShippingMethod,
        shippingMethods,
        /**
         * GraphQL mutations for Shipping Radios
         * 
         * @typedef {Object} ShippingRadiosMutations
         * 
         * @property {GraphQLAST} setShippingMethodMutation Mutation for setting the shipping method on a cart
         */
        mutations: { setShippingMethodMutation }
    } = props;
    const shippingMethodFieldApi = useFieldApi('method');

    const [
        setShippingMethod,
        { called: setShippingMethodCalled, loading: setShippingMethodLoading }
    ] = useMutation(setShippingMethodMutation);

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

    useEffect(() => {
        if (setShippingMethodCalled) {
            // If a shipping mutation is in flight, tell the cart.
            setIsCartUpdating(setShippingMethodLoading);
        }
    }, [setIsCartUpdating, setShippingMethodCalled, setShippingMethodLoading]);

    /**
     * Data to use when rendering shipping method radios.
     * 
     * @typedef {Object} ShippingRadiosProps
     * 
     * @property {Object} formattedShippingMethods
     * @property {Function} handleShippingSelection Callback function for handling shipping selection form updates
     */
    return {
        formattedShippingMethods,
        handleShippingSelection
    };
};
