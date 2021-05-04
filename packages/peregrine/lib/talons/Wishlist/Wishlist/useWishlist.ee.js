import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './product.gql';

export const useWishlist = props => {
    const {
        onWishlistUpdate,
        item,
        updateWishlistToastProps,
        onWishlistUpdateError
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getMultipleWishlistsEnabledQuery,
        addProductToWishlistMutation
    } = operations;

    const [isItemAdded, setIsItemAdded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { formatMessage } = useIntl();

    const [addProductToWishlist, { loading, called, error }] = useMutation(
        addProductToWishlistMutation,
        {
            refetchQueries: [{ query: getMultipleWishlistsEnabledQuery }]
        }
    );

    const { data: storeConfigData } = useQuery(
        getMultipleWishlistsEnabledQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    // enable_multiple_wishlists is a string "1" or "0". See documentation here:
    // https://devdocs.magento.com/guides/v2.4/graphql/mutations/create-wishlist.html
    const isMultipleWishlistsEnabled = useMemo(() => {
        return (
            storeConfigData &&
            !!storeConfigData.storeConfig.enable_multiple_wishlists &&
            storeConfigData.storeConfig.maximum_number_of_wishlists >
                storeConfigData.customer.wishlists.length
        );
    }, [storeConfigData]);

    const handleAddToWishlist = useCallback(
        async (wishlistId = '0') => {
            const { sku, quantity, selected_options } = item;

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

                setIsItemAdded(true);

                if (wishlistData && updateWishlistToastProps) {
                    const {
                        name
                    } = wishlistData.addProductsToWishlist.wishlist;

                    updateWishlistToastProps({
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

                if (isMultipleWishlistsEnabled) {
                    setIsModalOpen(false);
                }

                if (onWishlistUpdate) {
                    await onWishlistUpdate();
                }
            } catch (err) {
                console.error(err);

                if (onWishlistUpdateError) {
                    onWishlistUpdateError(err);
                }
            }
        },
        [
            addProductToWishlist,
            formatMessage,
            onWishlistUpdate,
            item,
            updateWishlistToastProps,
            onWishlistUpdateError,
            isMultipleWishlistsEnabled
        ]
    );

    const handleModalOpen = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(isSuccess => {
        setIsModalOpen(false);

        // only set item added true if someone calls handleModalClose(true)
        if (isSuccess) {
            setIsItemAdded(true);
        }
    }, []);

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
        isItemAdded,
        isModalOpen,
        handleModalOpen,
        handleModalClose
    };
};
