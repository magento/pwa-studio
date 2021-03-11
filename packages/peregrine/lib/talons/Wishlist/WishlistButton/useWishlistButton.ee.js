import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './wishlistButton.gql';

export const useWishlistButton = props => {
    const { itemOptions } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { addProductToWishlistMutation } = operations;

    const [itemAdded, setItemAdded] = useState(false);

    useEffect(() => {
        if (itemOptions.selected_options) setItemAdded(false);
    }, [itemOptions.selected_options]);

    const [
        addProductToWishlist,
        { loading: isAddLoading, error: addProductError }
    ] = useMutation(addProductToWishlistMutation);

    const handleClick = useCallback(async () => {
        alert('Opening Add To Wishlist Dialog!');
    }, []);

    return {
        addProductError,
        handleClick,
        isDisabled: itemAdded || isAddLoading,
        itemAdded
    };
};
