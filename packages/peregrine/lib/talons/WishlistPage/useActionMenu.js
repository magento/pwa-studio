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
 * @param {{id}} props
 * @param {ID} props.id - The unique identifier of the wish list
 * @param {Object} props.operations - GraphQL operations to be run by the talon.
 *
 * @returns {ActionMenuProps}
 */
export const useActionMenu = (props = {}) => {
    const { id } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerWishlistQuery, updateWishlistMutation } = operations;
    const [currentDialog, setCurrentDialog] = useState(dialogs.NONE);

    const handleActionMenuClick = useCallback(() => {
        setCurrentDialog(dialogs.LIST_ACTIONS);
    }, []);

    const handleHideDialogs = useCallback(() => {
        setCurrentDialog(dialogs.NONE);
    }, []);

    const listActionsIsOpen = currentDialog === dialogs.LIST_ACTIONS;
    const editFavoritesListIsOpen = currentDialog === dialogs.EDIT_WISHLIST;

    const handleShowEditFavorites = useCallback(() => {
        setCurrentDialog(dialogs.EDIT_WISHLIST);
    }, []);

    const [
        updateWishlist,
        { error: updateWishlistErrors, loading: isEditInProgress }
    ] = useMutation(updateWishlistMutation);

    const handleEditWishlist = useCallback(
        async data => {
            // add private visibility because is required field for ee
            if (data && !data.visibility) {
                data.visibility = 'PRIVATE';
            }

            try {
                await updateWishlist({
                    variables: {
                        name: data.name,
                        visibility: data.visibility,
                        wishlistId: id
                    },
                    refetchQueries: [{ query: getCustomerWishlistQuery }],
                    awaitRefetchQueries: true
                });
                setCurrentDialog(dialogs.NONE);
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [getCustomerWishlistQuery, id, updateWishlist]
    );

    return {
        editFavoritesListIsOpen,
        formErrors: [updateWishlistErrors],
        handleActionMenuClick,
        handleEditWishlist,
        handleHideDialogs,
        handleShowEditFavorites,
        isEditInProgress,
        listActionsIsOpen
    };
};

/**
 * Props data to use when rendering the Wishlist Action Menu component.
 *
 * @typedef {Object} ActionMenuProps
 *
 * @property {Boolean} editFavoritesListIsOpen Whether the Edit Favorites List dialog is open
 * @property {Function} handleActionMenuClick Callback to handle action menu clicks
 * @property {Function} handleEditWishlist Callback to handle edit wishlist
 * @property {Function} handleHideDialogs Callback to handle hiding all dialogs
 * @property {Function} handleShowEditFavorites Callback to handle showing the Edit Favorites List Dialog
 * @property {Boolean} isEditInProgress Whether the update wishlist operation is in progress
 * @property {Boolean} listActionsIsOpen Whether the list actions dialog is open
 */
