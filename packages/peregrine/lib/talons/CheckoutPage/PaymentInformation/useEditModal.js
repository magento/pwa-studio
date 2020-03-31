import { useState, useCallback } from 'react';

const useEditModal = props => {
    const { onClose } = props;
    const [isOpen, setIsOpen] = useState(true);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );

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

export default useEditModal;
