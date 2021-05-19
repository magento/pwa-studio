import { GET_PRODUCTS_IN_WISHLISTS } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/galleryButton.gql';

import { GET_WISHLIST_ITEMS } from '@magento/peregrine/lib/talons/Gallery/gallery.gql.ce';

import { GET_WISHLIST_CONFIG } from '@magento/peregrine/lib/talons/Gallery/gallery.gql.ee';

export default {
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS,
    getWishlistConfigQuery: GET_WISHLIST_CONFIG,
    getWishlistItemsQuery: GET_WISHLIST_ITEMS
};
