import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const usePaymentInformation = props => {
    const { onSave, operations } = props;

    const {
        queries: { getSelectedPaymentMethodQuery, getPaymentNonceQuery }
    } = operations;

    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );

    const [isEditModalHidden, setIsEditModalHidden] = useState(true);

    const [{ cartId }] = useCartContext();

    const { data: selectedPaymentMethodData } = useQuery(
        getSelectedPaymentMethodQuery,
        {
            variables: {
                cartId
            }
        }
    );

    const { data: paymentNonceData } = useQuery(getPaymentNonceQuery, {
        variables: {
            cartId
        }
    });

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

    const showEditModal = useCallback(() => {
        setIsEditModalHidden(false);
    }, [setIsEditModalHidden]);

    const hideEditModal = useCallback(() => {
        setIsEditModalHidden(true);
    }, [setIsEditModalHidden]);

    return {
        doneEditing: !!paymentNonce,
        handleReviewOrder,
        shouldRequestPaymentNonce,
        selectedPaymentMethod,
        paymentNonce,
        isEditModalHidden,
        showEditModal,
        hideEditModal
    };
};
