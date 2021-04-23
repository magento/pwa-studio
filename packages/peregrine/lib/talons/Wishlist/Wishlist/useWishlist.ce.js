import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './product.gql';

export const useWishlist = props => {
    const {
        onWishlistUpdate,
        item,
        updateWishlistToastProps,
        setDisplayError
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { addProductToWishlistMutation } = operations;

    const [isItemAdded, setIsItemAdded] = useState(false);

    const [addProductToWishlist, { loading, called, error }] = useMutation(
        addProductToWishlistMutation
    );

    const { formatMessage } = useIntl();

    const handleAddToWishlist = useCallback(async () => {
        const { sku, quantity, selected_options } = item;

        try {
            const { data: wishlistData } = await addProductToWishlist({
                variables: {
                    wishlistId: '0',
                    itemOptions: {
                        sku,
                        quantity,
                        selected_options
                    }
                }
            });

            setIsItemAdded(true);

            if (wishlistData && updateWishlistToastProps) {
                updateWishlistToastProps({
                    type: 'info',
                    message: formatMessage({
                        id: 'cartPage.wishlist.ce.successMessage',
                        defaultMessage:
                            'Item successfully added to your favorites list.'
                    }),
                    timeout: 5000
                });
            }

            if (onWishlistUpdate) {
                await onWishlistUpdate();
            }
        } catch (err) {
            console.error(err);

            // Make sure any errors from the mutation are displayed.
            if (setDisplayError) {
                setDisplayError(true);
            }
        }
    }, [
        addProductToWishlist,
        formatMessage,
        onWishlistUpdate,
        item,
        updateWishlistToastProps,
        setDisplayError
    ]);

    useEffect(() => {
        // If a user changes selections, let them add that combination to a list.
        if (item.selected_options) setIsItemAdded(false);
    }, [item.selected_options]);

    return {
        handleAddToWishlist,
        loading,
        called,
        error,
        isDisabled: isItemAdded || loading,
        isItemAdded
    };
};
