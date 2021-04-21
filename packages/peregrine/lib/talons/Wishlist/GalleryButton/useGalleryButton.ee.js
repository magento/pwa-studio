import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useApolloClient } from '@apollo/client';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useSingleWishlist } from './helpers/useSingleWishlist';

export const useGalleryButton = props => {
    const { item, storeConfig } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successToastName, setSuccessToastName] = useState();
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();

    const singleWishlistProps = useSingleWishlist(props);

    const apolloClient = useApolloClient();
    const { cache: apolloCache } = apolloClient;

    const buttonProps = useMemo(() => {
        const singleButtonProps = singleWishlistProps.buttonProps;
        if (storeConfig.enable_multiple_wishlists === '1' && isSignedIn) {
            return {
                ...singleButtonProps,
                onClick: () => setIsModalOpen(true)
            };
        }

        return singleButtonProps;
    }, [
        singleWishlistProps.buttonProps,
        isSignedIn,
        storeConfig.enable_multiple_wishlists
    ]);

    const handleModalClose = useCallback(
        (success, additionalData) => {
            setIsModalOpen(false);

            // only set item added true if someone calls handleModalClose(true)
            if (success === true) {
                apolloCache.modify({
                    id: 'ROOT_QUERY',
                    fields: {
                        customerWishlistProducts: cachedProducts => [
                            ...cachedProducts,
                            item.sku
                        ]
                    }
                });

                setSuccessToastName(additionalData.wishlistName);
            }
        },
        [apolloCache, item.sku]
    );

    const modalProps = useMemo(() => {
        if (storeConfig.enable_multiple_wishlists === '1' && isSignedIn) {
            return {
                isOpen: isModalOpen,
                itemOptions: {
                    sku: item.sku,
                    quantity: 1
                },
                onClose: handleModalClose
            };
        }

        return null;
    }, [
        handleModalClose,
        isModalOpen,
        isSignedIn,
        item.sku,
        storeConfig.enable_multiple_wishlists
    ]);

    const successToastProps = useMemo(() => {
        if (successToastName) {
            return {
                type: 'success',
                message: formatMessage(
                    {
                        id: 'wishlist.galleryButton.successMessageNamed',
                        defaultMessage:
                            'Item successfully added to the "{wishlistName}" list.'
                    },
                    {
                        wishlistName: successToastName
                    }
                ),
                timeout: 5000
            };
        }

        return singleWishlistProps.successToastProps;
    }, [
        singleWishlistProps.successToastProps,
        formatMessage,
        successToastName
    ]);

    return {
        ...singleWishlistProps,
        buttonProps,
        modalProps,
        successToastProps
    };
};
