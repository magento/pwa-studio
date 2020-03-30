import { useState, useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const usePaymentInformation = props => {
    const { onSave, operations } = props;

    const {
        queries: { getSelectedPaymentMethodQuery, getPaymentNonceQuery }
    } = operations;

    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );

    const [{ cartId }] = useCartContext();

    const [
        getSelectedPaymentMethod,
        { data: selectedPaymentMethodData, client }
    ] = useLazyQuery(getSelectedPaymentMethodQuery);

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

    const [getPaymentNonce, { data: paymentNonceData }] = useLazyQuery(
        getPaymentNonceQuery
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

    const selectedPaymentMethod = selectedPaymentMethodData
        ? selectedPaymentMethodData.cart.selectedPaymentMethod
        : null;

    const paymentNonce = paymentNonceData
        ? paymentNonceData.cart.paymentNonce
        : null;

    const handleReviewOrder = useCallback(() => {
        setShouldRequestPaymentNonce(true);
        onSave();
    }, [onSave]);

    const onPaymentSuccess = useCallback(
        paymentNonce => {
            setPaymentNonce(paymentNonce);
        },
        [setPaymentNonce]
    );

    useEffect(() => {
        if (cartId) {
            getSelectedPaymentMethod({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, getSelectedPaymentMethod]);

    useEffect(() => {
        if (cartId) {
            getPaymentNonce({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, getPaymentNonce]);

    return {
        doneEditing: !!paymentNonce,
        handleReviewOrder,
        shouldRequestPaymentNonce,
        onPaymentSuccess,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        paymentNonce
    };
};
