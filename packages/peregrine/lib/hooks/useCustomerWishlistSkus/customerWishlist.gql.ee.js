import { GET_PRODUCTS_IN_WISHLISTS } from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/addToListButton.gql';
import { GET_WISHLIST_ITEMS } from './customerWishlist.gql.ce';

export default {
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS,
    getWishlistItemsQuery: GET_WISHLIST_ITEMS
};
