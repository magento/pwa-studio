import { useState, useCallback } from 'react';

export const useCreateWishlist = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return {
        isModalOpen,
        hideModal,
        showModal
    };
};
