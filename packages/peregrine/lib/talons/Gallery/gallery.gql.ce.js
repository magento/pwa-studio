import { gql } from '@apollo/client';

import { GET_PRODUCTS_IN_WISHLISTS } from '../Wishlist/GalleryButton/galleryButton.gql';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForGalleryCE {
        storeConfig {
            id
            magento_wishlist_general_is_enabled
        }
    }
`;

export const GET_WISHLIST_ITEMS = gql`
    query GetWishlistItemsForLocalField($currentPage: Int!) {
        customer {
            id
            wishlists {
                id
                items_v2(currentPage: $currentPage, pageSize: 100) {
                    items {
                        id
                        product {
                            id
                            sku
                        }
                    }
                    page_info {
                        current_page
                        total_pages
                    }
                }
            }
        }
    }
`;

export default {
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS,
    getWishlistConfigQuery: GET_WISHLIST_CONFIG,
    getWishlistItemsQuery: GET_WISHLIST_ITEMS
};
