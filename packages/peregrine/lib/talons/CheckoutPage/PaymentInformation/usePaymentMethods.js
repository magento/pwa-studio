import { useEffect } from 'react';
import { useFieldState, useFormApi } from 'informed';
import { useApolloClient } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

/**
 * Talon to handle Payment Method component in the checkout page.
 *
 * @param {String} props.selectedPaymentMethod informed field value of the selected payment method
 * @param {DocumentNode} props.operations.queries.getSelectedPaymentMethodQuery query to save selected payment method in cache
 */
export const usePaymentMethods = props => {
    const { selectedPaymentMethod, operations } = props;
    const {
        queries: { getSelectedPaymentMethodQuery }
    } = operations;

    /**
     * Definitions
     */

    const { value: currentSelectedMethod } = useFieldState(
        'selectedPaymentMethod'
    );

    const formApi = useFormApi();

    const [{ cartId }] = useCartContext();

    const client = useApolloClient();

    /**
     * Effects
     */

    useEffect(() => {
        /**
         * currentSelectedMethod is the current selected payment method from
         * the form and selectedPaymentMethod is the value from cache.
         * If these are different and currentSelectedMethod is not null, means
         * the user change the payment method. Hence update cache with new value.
         */
        if (
            currentSelectedMethod &&
            selectedPaymentMethod !== currentSelectedMethod
        ) {
            client.writeQuery({
                query: getSelectedPaymentMethodQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        selectedPaymentMethod: currentSelectedMethod
                    }
                }
            });
        }
    }, [
        selectedPaymentMethod,
        currentSelectedMethod,
        cartId,
        client,
        getSelectedPaymentMethodQuery
    ]);

    useEffect(() => {
        /**
         * If currentSelectedMethod is null and selectedPaymentMethod is not
         * means the component is just mounted. Hence setting it with
         * the value from cache.
         */
        if (!currentSelectedMethod && selectedPaymentMethod) {
            formApi.setValue('selectedPaymentMethod', selectedPaymentMethod);
        }
    }, [currentSelectedMethod, selectedPaymentMethod, formApi]);
};
