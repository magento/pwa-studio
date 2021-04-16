import { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
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
    const {
        getMultipleWishlistsEnabledQuery,
        addProductToWishlistMutation
    } = operations;

    const { formatMessage } = useIntl();

    const { data: storeConfigData } = useQuery(
        getMultipleWishlistsEnabledQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [addProductToWishlist, { loading, called, error }] = useMutation(
        addProductToWishlistMutation
    );

    const isMultipleWishlistsEnabled = useMemo(() => {
        return (
            (storeConfigData &&
                storeConfigData.storeConfig.enable_multiple_wishlists ===
                    '1') ||
            false
        );
    }, [storeConfigData]);

    const handleAddToWishlist = useCallback(async () => {
        const sku = item.product.sku;
        const quantity = item.quantity;
        const selected_options = item.configurable_options.map(
            option => option.configurable_product_option_value_uid
        );

        /**
         * When we work on when we work on https://jira.corp.magento.com/browse/PWA-1599
         * this logic will change to the wishlist the user would like to add the item to.
         */
        const wishlistId = isMultipleWishlistsEnabled ? '0' : '0';

        try {
            const { data: wishlistData } = await addProductToWishlist({
                variables: {
                    wishlistId,
                    itemOptions: {
                        sku,
                        quantity,
                        selected_options
                    }
                }
            });

            if (wishlistData) {
                const { name } = wishlistData.addProductsToWishlist.wishlist;

                onAddToWishlistSuccess({
                    type: 'info',
                    message: formatMessage(
                        {
                            id: 'cartPage.wishlist.ee.successMessage',
                            defaultMessage: `Item successfully added to ${name}.`
                        },
                        { wishlistName: name }
                    ),
                    timeout: 5000
                });
            }

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
        isMultipleWishlistsEnabled,
        formatMessage,
        removeItemFromCart,
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
