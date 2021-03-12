import { useCallback, useEffect, useState } from 'react';

export const useWishlistButton = props => {
    const { itemOptions } = props;

    const [isItemAdded, setIsItemAdded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // If a user changes selections, let them add that combination to a list.
        if (itemOptions.selected_options) setIsItemAdded(false);
    }, [itemOptions.selected_options]);

    const handleButtonClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(success => {
        setIsModalOpen(false);

        // only set item added true if someone calls handleModalClose(true)
        if (success === true) {
            setIsItemAdded(true);
        }
    }, []);

    return {
        handleButtonClick,
        handleModalClose,
        isDisabled: isItemAdded || isModalOpen,
        isItemAdded,
        isModalOpen
    };
};
