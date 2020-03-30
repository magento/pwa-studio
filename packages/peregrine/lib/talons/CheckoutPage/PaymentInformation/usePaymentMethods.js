import { useEffect, useCallback } from 'react';
import { useFieldState, useFormApi } from 'informed';
import { useApolloClient } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const usePaymentMethods = props => {
    const { selectedPaymentMethod, operations } = props;

    const {
        queries: { getSelectedPaymentMethodQuery, getPaymentNonceQuery }
    } = operations;

    const { value: selectedOption } = useFieldState('selectedPaymentMethod');

    const formApi = useFormApi();

    const [{ cartId }] = useCartContext();

    const client = useApolloClient();

    const setSelectedPaymentMethod = useCallback(
        selectedPaymentMethod => {
            client.writeQuery({
                query: getSelectedPaymentMethodQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        selectedPaymentMethod
                    }
                }
            });
        },
        [cartId, client, getSelectedPaymentMethodQuery]
    );

    const setPaymentNonce = useCallback(
        paymentNonce => {
            client.writeQuery({
                query: getPaymentNonceQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        paymentNonce
                    }
                }
            });
        },
        [cartId, client, getPaymentNonceQuery]
    );

    useEffect(() => {
        if (selectedOption && selectedPaymentMethod !== selectedOption) {
            setSelectedPaymentMethod(selectedOption);
        }
    }, [setSelectedPaymentMethod, selectedPaymentMethod, selectedOption]);

    useEffect(() => {
        if (!selectedOption && selectedPaymentMethod !== selectedOption) {
            formApi.setValue('selectedPaymentMethod', selectedPaymentMethod);
        }
    }, [selectedOption, selectedPaymentMethod, formApi]);

    const onPaymentSuccess = useCallback(
        paymentNonce => {
            setPaymentNonce(paymentNonce);
        },
        [setPaymentNonce]
    );

    return { onPaymentSuccess };
};
