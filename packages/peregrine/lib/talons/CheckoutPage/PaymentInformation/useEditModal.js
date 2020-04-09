import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';

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
 *   shouldRequestPaymentNonce: Boolean,
 *   handleClose: Function,
 *   handleUpdate: Function,
 *   handlePaymentSuccess: Function,
 *   handleDropinReady: Function,
 *   handlePaymentError: Function
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
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const [{ cartId }] = useCartContext();

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
    const selectedPaymentMethod = selectedPaymentMethodData
        ? selectedPaymentMethodData.cart.selectedPaymentMethod.code
        : null;

    /**
     * Helper Functions
     */

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleUpdate = useCallback(() => {
        setShouldRequestPaymentNonce(true);
    }, [setShouldRequestPaymentNonce]);

    const handlePaymentSuccess = useCallback(() => {
        onClose();
    }, [onClose]);

    const handlePaymentError = useCallback(() => {
        setShouldRequestPaymentNonce(false);
    }, []);

    const handleDropinReady = useCallback(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    return {
        selectedPaymentMethod,
        isLoading,
        shouldRequestPaymentNonce,
        handleClose,
        handleUpdate,
        handlePaymentSuccess,
        handlePaymentError,
        handleDropinReady
    };
};
