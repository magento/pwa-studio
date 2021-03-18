import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './wishlistButton.gql';

export const useWishlistButton = props => {
    const { itemOptions } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { addProductToWishlistMutation } = operations;

    const [isItemAdded, setIsItemAdded] = useState(false);

    useEffect(() => {
        // If a user changes selections, let them add that combination to a list.
        if (itemOptions.selected_options) setIsItemAdded(false);
    }, [itemOptions.selected_options]);

    const [
        addProductToWishlist,
        { loading: isAddLoading, error: addProductError }
    ] = useMutation(addProductToWishlistMutation);

    const handleClick = useCallback(async () => {
        try {
            await addProductToWishlist({
                variables: {
                    // TODO: "0" will create a wishlist if doesn't exist, and add to one if it does, regardless of the user's single wishlist id. In 2.4.3 this will be "fixed" by removing the `wishlistId` param entirely because all users will have a wishlist created automatically in CE. So should only have to pass items and it will add correctly.
                    wishlistId: '0',
                    itemOptions
                }
            });
            setIsItemAdded(true);
        } catch (err) {
            console.log(err);
        }
    }, [addProductToWishlist, itemOptions]);

    return {
        addProductError,
        handleClick,
        isDisabled: isItemAdded || isAddLoading,
        isItemAdded
    };
};
