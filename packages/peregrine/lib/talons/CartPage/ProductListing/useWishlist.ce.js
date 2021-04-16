import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './product.gql';

export const useWishlist = props => {
    const {
        removeItemFromCart,
        cartId,
        item,
        onAddToWishlistSuccess,
        setDisplayError
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { addProductToWishlistMutation } = operations;

    const [addProductToWishlist, { loading, called, error }] = useMutation(
        addProductToWishlistMutation
    );

    const { formatMessage } = useIntl();

    const handleAddToWishlist = useCallback(async () => {
        const sku = item.product.sku;
        const quantity = item.quantity;
        const selected_options = item.configurable_options.map(
            option => option.configurable_product_option_value_uid
        );

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

            wishlistData &&
                onAddToWishlistSuccess({
                    type: 'info',
                    message: formatMessage({
                        id: 'cartPage.wishlist.ce.successMessage',
                        defaultMessage:
                            'Item successfully added to your favorites list.'
                    }),
                    timeout: 5000
                });

            await removeItemFromCart({
                variables: {
                    cartId,
                    itemId: item.id
                }
            });
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
            setDisplayError(true);
        }
    }, [
        addProductToWishlist,
        removeItemFromCart,
        formatMessage,
        cartId,
        item,
        onAddToWishlistSuccess,
        setDisplayError
    ]);

    return {
        handleAddToWishlist,
        loading,
        called,
        error
    };
};
