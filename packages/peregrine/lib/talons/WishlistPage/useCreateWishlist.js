import { useState, useCallback } from 'react';

export const useCreateWishlist = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const createList = useCallback(data => {
        // TODO create list mutation is not available yet
        console.log('Creating wish list with data: ', data);
        setIsModalOpen(false);
    }, []);

    return {
        createList,
        isModalOpen,
        hideModal,
        showModal
    };
};
