import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './wishlistDialog.gql';

export const useWishlistDialog = props => {
    const { itemOptions, onClose } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data: wishlistsData } = useQuery(operations.getWishlistsQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [
        addProductToWishlist,
        { loading: isAddLoading, error: addProductError }
    ] = useMutation(operations.addProductToWishlistMutation, {
        refetchQueries: [{ query: operations.getWishlistsQuery }]
    });

    // enable_multiple_wishlists is a string "1" or "0". See documentation here:
    // https://devdocs.magento.com/guides/v2.4/graphql/mutations/create-wishlist.html
    const canCreateWishlist = useMemo(() => {
        return (
            wishlistsData &&
            !!wishlistsData.storeConfig.enable_multiple_wishlists &&
            wishlistsData.storeConfig.maximum_number_of_wishlists >
                wishlistsData.customer.wishlists.length
        );
    }, [wishlistsData]);

    const handleAddToWishlist = useCallback(
        async wishlistId => {
            try {
                await addProductToWishlist({
                    variables: {
                        wishlistId,
                        itemOptions
                    }
                });
                onClose(true);
                setIsFormOpen(false);
            } catch (err) {
                console.log(err);
            }
        },
        [addProductToWishlist, itemOptions, onClose]
    );

    const handleNewListClick = useCallback(() => {
        setIsFormOpen(true);
    }, []);

    const handleCancelNewList = useCallback(() => {
        setIsFormOpen(false);
    }, []);

    const handleCancel = useCallback(() => {
        onClose();
        setIsFormOpen(false);
    }, [onClose]);

    return {
        formErrors: [addProductError],
        canCreateWishlist,
        handleAddToWishlist,
        handleCancel,
        handleCancelNewList,
        handleNewListClick,
        isAddLoading,
        isFormOpen,
        wishlistsData
    };
};
