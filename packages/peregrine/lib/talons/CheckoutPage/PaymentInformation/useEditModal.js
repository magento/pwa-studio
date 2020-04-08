import { useState, useCallback } from 'react';

/**
 * Talon to handle checkout page's payment information edit modal.
 *
 * @param {Function} props.onClose callback to be called when the modal's close or cancel button is clicked.
 *
 * @returns {
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
    const { onClose } = props;

    /**
     * Definitions
     */

    const [isLoading, setIsLoading] = useState(true);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );

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
        isLoading,
        shouldRequestPaymentNonce,
        handleClose,
        handleUpdate,
        handlePaymentSuccess,
        handlePaymentError,
        handleDropinReady
    };
};
