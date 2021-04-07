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

    const handleClick = useCallback(() => {
        if (storeConfig.enable_multiple_wishlists === '0' && isSignedIn) {
            setIsModalOpen(true);
        } else {
            ceTalonProps.handleClick();
        }
    }, [ceTalonProps, isSignedIn, storeConfig.enable_multiple_wishlists]);

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

    const getModalProps = useCallback(
        (additionalProps = {}) => ({
            isOpen: isModalOpen,
            itemOptions: {
                sku: item.sku,
                quantity: 1
            },
            onClose: handleModalClose,
            ...additionalProps
        }),
        [handleModalClose, isModalOpen, item.sku]
    );

    const getSuccessToastProps = useMemo(() => {
        if (successToastName) {
            return (additionalProps = {}) => ({
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
                timeout: 5000,
                ...additionalProps
            });
        }

        return null;
    }, [formatMessage, successToastName]);

    return {
        ...ceTalonProps,
        getModalProps,
        getSuccessToastProps,
        handleClick
    };
};
