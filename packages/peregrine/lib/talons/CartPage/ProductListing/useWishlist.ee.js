import { useCallback } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './product.gql';

export const useWishlist = props => {
    const {
        addProductToWishlist,
        removeProductFromWishlist,
        removeItemFromCart,
        cartId,
        item,
        setDisplayError
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, operations);
    const { getMultipleWishlistsEnabledQuery } = operations;

    const { data: storeConfigData } = useQuery(
        getMultipleWishlistsEnabledQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
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

            try {
                await removeItemFromCart({
                    variables: {
                        cartId,
                        itemId: item.id
                    }
                });
            } catch (err) {
                // remove item from cart has failed, should roll back the change
                // by removing the item from the wishlist
                const selectedOptionsMapper = item.configurable_options.reduce(
                    (acc, option) => {
                        const { option_label, value_label } = option;
                        acc[option_label] = value_label;

                        return acc;
                    },
                    {}
                );

                const {
                    items: { items },
                    id: wishlistId
                } = wishlistData.addProductsToWishlist.wishlist;

                const productToDelete = items
                    .filter(({ product }) => product.sku === sku)
                    .find(item => {
                        const { configurable_options } = item;

                        return (
                            configurable_options.length &&
                            configurable_options.every(option => {
                                const { option_label, value_label } = option;

                                return (
                                    selectedOptionsMapper[option_label] ===
                                    value_label
                                );
                            })
                        );
                    });

                await removeProductFromWishlist({
                    variables: {
                        wishlistId: wishlistId,
                        wishlistItemId: productToDelete.id
                    }
                });

                throw new Error(err);
            }
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [
        addProductToWishlist,
        isMultipleWishlistsEnabled,
        removeProductFromWishlist,
        removeItemFromCart,
        cartId,
        item,
        setDisplayError
    ]);

    return {
        handleAddToWishlist
    };
};
