import { useState, useCallback } from 'react';

/**
 * Talon to handle checkout page's payment information edit modal.
 *
 * @param {Function} props.onClose callback to be called when the modal's close or cancel button is clicked.
 *
 * @returns {
 *   isOpen: Boolean,
 *   shouldRequestPaymentNonce: Boolean,
 *   handleClose: Function,
 *   handleUpdate: Function,
 *   handlePaymentSuccess: Function
 * }
 */
export const useEditModal = props => {
    const { onClose } = props;

    /**
     * Definitions
     */

    const [isOpen, setIsOpen] = useState(true);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );

    /**
     * Helper Functions
     */

    const handleClose = useCallback(() => {
        setIsOpen(false);
        onClose();
    }, [onClose]);

    const handleUpdate = useCallback(() => {
        setShouldRequestPaymentNonce(true);
    }, [setShouldRequestPaymentNonce]);

    const handlePaymentSuccess = useCallback(() => {
        setIsOpen(false);
        onClose();
    }, [onClose]);

    return {
        isOpen,
        shouldRequestPaymentNonce,
        handleClose,
        handleUpdate,
        handlePaymentSuccess
    };
};
