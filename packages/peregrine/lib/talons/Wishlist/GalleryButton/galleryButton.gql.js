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

/* eslint-disable graphql/template-strings */
export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query GetProductsInWishlistsForGallery {
        customerWishlistProducts @client
    }
`;
/* eslint-enable graphql/template-strings */

export default {
    addProductToWishlistMutation: ADD_TO_WISHLIST,
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS
};
