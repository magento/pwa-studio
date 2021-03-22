import { useCallback, useState } from 'react';

/**
 * @function
 *
 * @returns {WishListProps}
 */
export const useWishlist = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleContentToggle = () => {
        setIsOpen(currentValue => !currentValue);
    };

    const handleActionMenuClick = useCallback(() => {
        console.log('To be handled by PWA-632');
    }, []);

    return {
        handleActionMenuClick,
        handleContentToggle,
        isOpen
    };
};

/**
 * JSDoc type definitions
 */

/**
 * Props data to use when rendering the Wishlist component.
 *
 * @typedef {Object} WishListProps
 *
 * @property {Function} handleActionMenuClick Callback to handle action menu clicks
 * @property {Function} handleContentToggle Callback to handle list expand toggle
 * @property {Boolean} isOpen Boolean which represents if the content is expanded or not
 */
