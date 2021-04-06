import { gql } from '@apollo/client';

export const ADD_TO_WISHLIST = gql`
    mutation AddProductToWishlistFromGallery($wishlistId: ID!, $sku: String!) {
        addProductsToWishlist(
            wishlistId: $wishlistId
            wishlistItems: [{ quantity: 1, sku: $sku }]
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
        wishlistProducts @client
    }
`;

export default {
    addProductToWishlistMutation: ADD_TO_WISHLIST,
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS
};
