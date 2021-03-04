import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from './wishlist.gql';
import mergeOperations from '../../util/shallowMerge';

const dialogs = {
    NONE: 1,
    LIST_ACTIONS: 2,
    EDIT_WISHLIST: 3
};

/**
 * @function
 *
 * @returns {WishListProps}
 */
export const useWishlist = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { updateWishlistMutation } = operations;
    const [isOpen, setIsOpen] = useState(true);
    const [currentDialog, setCurrentDialog] = useState(dialogs.NONE);

    const handleContentToggle = () => {
        setIsOpen(currentValue => !currentValue);
    };

    const handleActionMenuClick = useCallback(() => {
        setCurrentDialog(dialogs.LIST_ACTIONS);
    }, []);

    const handleHideDialogs = useCallback(() => {
        setCurrentDialog(dialogs.NONE);
    }, [setCurrentDialog]);

    const listActionsIsOpen = currentDialog === dialogs.LIST_ACTIONS;
    const editFavoritesListIsOpen = currentDialog === dialogs.EDIT_WISHLIST;

    const handleShowEditFavorites = useCallback(() => {
        setCurrentDialog(dialogs.EDIT_WISHLIST);
    }, [setCurrentDialog]);

    const [updateWishlist] = useMutation(updateWishlistMutation);

    const handleEditWishlist = useCallback(
        async data => {
            updateWishlist({
                variables: {
                    name: data.name,
                    visibility: data.visibility,
                    wishlistId: data.id
                }
            });
        },
        [updateWishlist]
    );

    return {
        editFavoritesListIsOpen,
        handleActionMenuClick,
        handleContentToggle,
        handleEditWishlist,
        handleHideDialogs,
        handleShowEditFavorites,
        isOpen,
        listActionsIsOpen
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
 * @property {Boolean} editFavoritesListIsOpen Whether the Edit Favorites List dialog is open
 * @property {Function} handleActionMenuClick Callback to handle action menu clicks
 * @property {Function} handleContentToggle Callback to handle list expand toggle
 * @property {Function} handleEditWishlist Callback to handle edit wishlist
 * @property {Function} handleHideDialogs Callback to handle hiding all dialogs
 * @property {Function} handleShowEditFavorites Callback to handle showing the Edit Favorites List Dialog
 * @property {Boolean} isOpen Boolean which represents if the content is expanded or not
 * @property {Boolean} listActionsIsOpen Whether the list actions dialog is open
 */
