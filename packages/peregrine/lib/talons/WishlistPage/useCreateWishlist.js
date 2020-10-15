import { useState, useCallback } from 'react';

/**
 * @function
 *
 * @returns {CreateWishListProps}
 */
export const useCreateWishlist = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShowModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleHideModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleCreateList = useCallback(data => {
        // TODO create list mutation is not available yet
        // Will be handled in PWA-989
        console.log('Creating wish list with data: ', data);
        setIsModalOpen(false);
    }, []);

    return {
        handleCreateList,
        handleHideModal,
        handleShowModal,
        isModalOpen
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
 * @property {Function} handleCreateList Callback to be called while creating new list
 * @property {Function} handleHideModal Callback to hide the create modal by modifying the value of isModalOpen
 * @property {Function} handleShowModal Callback to show the create modal by modifying the value of isModalOpen
 * @property {Boolean} isModalOpen Boolean which represents if the create modal is open or not
 */
