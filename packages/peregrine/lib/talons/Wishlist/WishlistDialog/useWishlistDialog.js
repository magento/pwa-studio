import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './wishlistDialog.gql';

export const useWishlistDialog = props => {
    const { itemOptions, onClose } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { data: wishlistsData } = useQuery(operations.getWishlistsQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [
        addProductToWishlist,
        { loading: isAddLoading, error: addProductError }
    ] = useMutation(operations.addProductToWishlistMutation);

    // enable_multiple_wishlists is a string "1" or "0". See documentation here:
    // https://devdocs.magento.com/guides/v2.4/graphql/mutations/create-wishlist.html
    const canCreateWishlist =
        wishlistsData &&
        !!wishlistsData.storeConfig.enable_multiple_wishlists &&
        wishlistsData.storeConfig.maximum_number_of_wishlists >
            wishlistsData.customer.wishlists.length;

    const handleAddToWishlist = useCallback(
        async wishlistId => {
            console.log('adding to id', wishlistId, itemOptions);
            try {
                await addProductToWishlist({
                    variables: {
                        wishlistId,
                        itemOptions
                    }
                });
                onClose(true);
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(err);
                }
            }
        },
        [addProductToWishlist, itemOptions, onClose]
    );

    return {
        formErrors: [addProductError],
        canCreateWishlist,
        handleAddToWishlist,
        isAddLoading,
        wishlistsData
    };
};
