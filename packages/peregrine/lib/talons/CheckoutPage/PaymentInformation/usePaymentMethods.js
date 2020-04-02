import { useEffect } from 'react';
import { useFieldState, useFormApi } from 'informed';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

/**
 * Talon to handle Payment Method component in the checkout page.
 *
 * @param {DocumentNode} props.operations.queries.getSelectedPaymentMethodQuery query to save selected payment method in cache
 */
export const usePaymentMethods = props => {
    const { operations } = props;
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
     * Queries
     */

    const { data: selectedPaymentMethodData } = useQuery(
        getSelectedPaymentMethodQuery,
        {
            variables: {
                cartId
            }
        }
    );

    const selectedPaymentMethodFromCache = selectedPaymentMethodData
        ? selectedPaymentMethodData.cart.selectedPaymentMethod
        : null;

    /**
     * Effects
     */

    useEffect(() => {
        /**
         * currentSelectedMethod is the current selected payment method from
         * the form and selectedPaymentMethodFromCache is the value from cache.
         * If these are different and currentSelectedMethod is not null, means
         * the user change the payment method. Hence update cache with new value.
         */
        if (
            currentSelectedMethod &&
            selectedPaymentMethodFromCache !== currentSelectedMethod
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
        selectedPaymentMethodFromCache,
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
        if (!currentSelectedMethod && selectedPaymentMethodFromCache) {
            formApi.setValue(
                'selectedPaymentMethod',
                selectedPaymentMethodFromCache
            );
        }
    }, [currentSelectedMethod, selectedPaymentMethodFromCache, formApi]);
};
