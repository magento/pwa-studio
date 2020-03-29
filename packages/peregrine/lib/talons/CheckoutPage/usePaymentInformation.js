import { useState, useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const usePaymentInformation = props => {
    const { onSave, operations } = props;
    const {
        queries: { getSelectedPaymentMethodQuery }
    } = operations;
    const [doneEditing, setDoneEditing] = useState(false);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const [paymentNonce, setPaymentNonce] = useState(null);
    const [{ cartId }] = useCartContext();
    const handleReviewOrder = useCallback(() => {
        // setDoneEditing(true); // TODO, this should move to payment on success
        setShouldRequestPaymentNonce(true);
        onSave();
    }, [onSave]);
    const onPaymentSuccess = useCallback(
        paymentNonce => {
            setPaymentNonce(paymentNonce);
            setDoneEditing(true);
        },
        [setDoneEditing]
    );
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

    useEffect(() => {
        if (cartId) {
            getSelectedPaymentMethod({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, getSelectedPaymentMethod]);

    return {
        doneEditing,
        handleReviewOrder,
        shouldRequestPaymentNonce,
        onPaymentSuccess,
        paymentNonce,
        setSelectedPaymentMethod,
        selectedPaymentMethod: selectedPaymentMethodData
            ? selectedPaymentMethodData.cart.selectedPaymentMethod
            : null
    };
};
