import { gql } from '@apollo/client';

export const CREATE_WISHLIST = gql`
    mutation createWishlist($input: CreateWishlistInput!) {
        createWishlist(input: $input) {
            wishlist {
                id
            }
        }
    }
`;

export const GET_MULTIPLE_WISHLISTS_ENABLED = gql`
    query getMultipleWishlistsEnabled {
        storeConfig {
            id
            enable_multiple_wishlists
        }
    }
`;

export default {
    createWishlistMutation: CREATE_WISHLIST,
    getMultipleWishlistsEnabledQuery: GET_MULTIPLE_WISHLISTS_ENABLED
};
