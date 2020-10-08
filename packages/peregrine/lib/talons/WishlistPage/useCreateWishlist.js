import { useState, useCallback } from 'react';

/**
 * @function
 *
 * @returns {CreateWishListProps}
 */
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
        // Will be handled in PWA-629
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

/**
 * JSDoc type definitions
 */

/**
 * Props data to use when rendering the Create Wishlist component.
 *
 * @typedef {Object} CreateWishListProps
 *
 * @property {Function} createList Callback to be called while creating new list
 * @property {Boolean} isModalOpen Boolean which represents if the create modal is open or not
 * @property {Function} hideModal Callback to hide the create modal by modifying the value of isModalOpen
 * @property {Function} showModal Callback to show the create modal by modifying the value of isModalOpen
 */
