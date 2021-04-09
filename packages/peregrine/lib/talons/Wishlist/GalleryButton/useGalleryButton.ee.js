import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useIntl } from 'react-intl';

import { useUserContext } from '../../../context/user';
import operations from './galleryButton.gql';
import { useGalleryButton as useGalleryButtonCE } from './useGalleryButton.ce';

export const useGalleryButton = props => {
    const { item, storeConfig } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successToastName, setSuccessToastName] = useState();
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();

    const ceTalonProps = useGalleryButtonCE(props);

    const {
        client,
        data: { customerWishlistProducts }
    } = useQuery(operations.getProductsInWishlistsQuery);

    const buttonProps = useMemo(() => {
        const ceButtonProps = ceTalonProps.buttonProps;
        if (storeConfig.enable_multiple_wishlists === '1' && isSignedIn) {
            return {
                ...ceButtonProps,
                onClick: () => setIsModalOpen(true)
            };
        }

        return ceButtonProps;
    }, [
        ceTalonProps.buttonProps,
        isSignedIn,
        storeConfig.enable_multiple_wishlists
    ]);

    const handleModalClose = useCallback(
        (success, additionalData) => {
            setIsModalOpen(false);

            // only set item added true if someone calls handleModalClose(true)
            if (success === true) {
                client.writeQuery({
                    query: operations.getProductsInWishlistsQuery,
                    data: {
                        customerWishlistProducts: [
                            ...customerWishlistProducts,
                            item.sku
                        ]
                    }
                });

                setSuccessToastName(additionalData.wishlistName);
            }
        },
        [client, customerWishlistProducts, item.sku]
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

        return ceTalonProps.successToastProps;
    }, [ceTalonProps.successToastProps, formatMessage, successToastName]);

    return {
        ...ceTalonProps,
        buttonProps,
        modalProps,
        successToastProps
    };
};
