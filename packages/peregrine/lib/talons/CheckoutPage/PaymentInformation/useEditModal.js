import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';

import { useCartContext } from '../../../context/cart';

/**
 * Talon to handle checkout page's payment information edit modal.
 *
 * @param {Function} props.onClose callback to be called when the modal's close or cancel button is clicked.
 * @param {DocumentNode} props.queries.getSelectedPaymentMethodQuery query to fetch the payment method that was used in the payment information checkout step
 *
 * @returns {
 *   selectedPaymentMethod: String,
 *   isLoading: Boolean,
 *   updateButtonClicked: Boolean,
 *   handleClose: Function,
 *   handleUpdate: Function,
 *   handlePaymentSuccess: Function,
 *   handleDropinReady: Function,
 *   handlePaymentError: Function,
 *   resetUpdateButtonClicked: Function
 * }
 */
export const useEditModal = props => {
    const {
        onClose,
        queries: { getSelectedPaymentMethodQuery }
    } = props;

    /**
     * Definitions
     */

    const [isLoading, setIsLoading] = useState(true);
    const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
    const [{ cartId }] = useCartContext();

    /**
     * Queries
     */

    const { data: selectedPaymentMethodData } = useQuery(
        getSelectedPaymentMethodQuery,
        {
            skip: !cartId,
            variables: {
                cartId
            }
        }
    );
    const selectedPaymentMethod = selectedPaymentMethodData
        ? selectedPaymentMethodData.cart.selected_payment_method.code
        : null;

    /**
     * Helper Functions
     */

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleUpdate = useCallback(() => {
        setUpdateButtonClicked(true);
    }, [setUpdateButtonClicked]);

    const handlePaymentSuccess = useCallback(() => {
        onClose();
    }, [onClose]);

    const handlePaymentError = useCallback(() => {
        setUpdateButtonClicked(false);
    }, []);

    const handleDropinReady = useCallback(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    const resetUpdateButtonClicked = useCallback(() => {
        setUpdateButtonClicked(false);
    }, [setUpdateButtonClicked]);

    return {
        selectedPaymentMethod,
        isLoading,
        updateButtonClicked,
        handleClose,
        handleUpdate,
        handlePaymentSuccess,
        handlePaymentError,
        handleDropinReady,
        resetUpdateButtonClicked
    };
};
