import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useUserContext } from '../../context/user';
import mergeOperations from '../../util/shallowMerge';
import defaultOperations from './gallery.gql';

export const useGallery = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    const [{ isSignedIn }] = useUserContext();

    const [currentPage, setCurrentPage] = useState(1);

    const {
        client,
        data: { wishlistProducts }
    } = useQuery(operations.getProductsInWishlistsQuery);

    const { data: wishlistConfigData } = useQuery(
        operations.getWishlistConfigQuery,
        { fetchPolicy: 'cache-and-network' }
    );

    const { data: wishlistItemsData } = useQuery(
        operations.getWishlistItemsQuery,
        {
            fetchPolicy: 'cache-and-network',
            onCompleted: data => {
                const itemsToAdd = new Set();
                const wishlists = data.customer.wishlists;
                wishlists.map(wishlist => {
                    const items = wishlist.items_v2.items;
                    items.map(item => {
                        const sku = item.product.sku;
                        if (!wishlistProducts.includes(sku)) {
                            itemsToAdd.add(sku);
                        }
                    });
                });

                if (itemsToAdd.size) {
                    client.writeQuery({
                        query: operations.getProductsInWishlistsQuery,
                        data: {
                            wishlistProducts: [
                                ...wishlistProducts,
                                ...itemsToAdd
                            ]
                        }
                    });
                }
            },
            skip: !isSignedIn,
            variables: {
                currentPage
            }
        }
    );

    useEffect(() => {
        if (wishlistItemsData) {
            const wishlists = wishlistItemsData.customer.wishlists;
            for (const wishlist of wishlists) {
                const pageInfo = wishlist.items_v2.page_info;

                if (pageInfo.total_pages > pageInfo.current_page) {
                    setCurrentPage(current => ++current);
                    break;
                }
            }
        }
    }, [wishlistItemsData]);

    const storeConfig = wishlistConfigData
        ? wishlistConfigData.storeConfig
        : null;

    return {
        storeConfig
    };
};
