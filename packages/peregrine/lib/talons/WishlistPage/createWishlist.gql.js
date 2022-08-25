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
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            enable_multiple_wishlists
            maximum_number_of_wishlists
        }
    }
`;

export default {
    createWishlistMutation: CREATE_WISHLIST,
    getMultipleWishlistsEnabledQuery: GET_MULTIPLE_WISHLISTS_ENABLED
};
