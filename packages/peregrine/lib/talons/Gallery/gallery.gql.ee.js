import { gql } from '@apollo/client';

import { GET_PRODUCTS_IN_WISHLISTS } from '../Wishlist/GalleryButton/galleryButton.gql';
import { GET_WISHLIST_ITEMS } from './gallery.gql.ce';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForGalleryEE {
        storeConfig {
            id
            magento_wishlist_general_is_enabled
            enable_multiple_wishlists
        }
    }
`;

export default {
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS,
    getWishlistConfigQuery: GET_WISHLIST_CONFIG,
    getWishlistItemsQuery: GET_WISHLIST_ITEMS
};
