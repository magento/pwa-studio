import { gql } from '@apollo/client';

export const ADD_TO_WISHLIST = gql`
    mutation AddProductToWishlistFromGallery(
        $wishlistId: ID!
        $itemOptions: WishlistItemInput!
    ) {
        addProductsToWishlist(
            wishlistId: $wishlistId
            wishlistItems: [$itemOptions]
        ) {
            user_errors {
                code
                message
            }
        }
    }
`;

export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query GetProductsInWishlistsForGallery {
        customerWishlistProducts @client
    }
`;

export default {
    addProductToWishlistMutation: ADD_TO_WISHLIST,
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS
};
