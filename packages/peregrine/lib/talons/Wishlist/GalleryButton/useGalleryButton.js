import { useCallback, useMemo, useState } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './galleryButton.gql';
import { useMutation, useQuery } from '@apollo/client';

export const useGalleryButton = props => {
    const { item } = props;

    const operations = mergeOperations(defaultOperations, props.operations);

    const [
        addProductToWishlist,
        { client, data: addProductData, loading }
    ] = useMutation(operations.addProductToWishlistMutation);

    const {
        data: { wishlistProducts }
    } = useQuery(operations.getProductsInWishlistsQuery);

    const isSelected = useMemo(() => {
        return wishlistProducts.includes(item.sku);
    }, [item.sku, wishlistProducts]);

    const [showLoginToast, setShowLoginToast] = useState(0);

    const [{ isSignedIn }] = useUserContext();

    const handleClick = useCallback(async () => {
        if (!isSignedIn) {
            setShowLoginToast(current => ++current);
        } else {
            try {
                await addProductToWishlist({
                    variables: { wishlistId: '0', sku: item.sku }
                });

                client.writeQuery({
                    query: operations.getProductsInWishlistsQuery,
                    data: {
                        wishlistProducts: [...wishlistProducts, item.sku]
                    }
                });
            } catch {
                // errors automatically logged by error handler
            }
        }
    }, [
        addProductToWishlist,
        client,
        isSignedIn,
        item.sku,
        operations.getProductsInWishlistsQuery,
        wishlistProducts
    ]);

    return {
        handleClick,
        isLoading: loading,
        isSelected,
        showLoginToast,
        showSuccessToast: !!addProductData
    };
};
