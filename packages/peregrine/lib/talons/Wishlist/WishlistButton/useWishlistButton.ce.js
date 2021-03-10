import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './wishlistButton.gql';

export const useWishlistButton = props => {
    const { itemOptions } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { addProductToWishlistMutation } = operations;

    // TODO: Using local state is a temporary solution. The real solution will be some check to see if the sku (for simple items) or sku + selected_options (for configurable) exists in a wishlist (or _the_ wishlist for CE). Currently, there seems to be a server error when attempting to query for `configurable_product_option_value_uid` on ConfigurableWishlistItem.configurable_options.
    const [itemAdded, setItemAdded] = useState(false);

    // TODO: As with above, this just mimics the behavior we anticipate - you can add a product with any number of selected options to your wishlist, so whenever you change options, indicate that this new selection is _not_ in the list. We can remove this when we fix the server error.
    useEffect(() => {
        if (itemOptions.selected_options) setItemAdded(false);
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
            setItemAdded(true);
        } catch (err) {
            if (process.env.NODE_ENV === 'production') {
                console.log(err);
            }
        }
    }, [addProductToWishlist, itemOptions]);

    return {
        addProductError,
        handleClick,
        isDisabled: isAddLoading,
        itemAdded
    };
};
