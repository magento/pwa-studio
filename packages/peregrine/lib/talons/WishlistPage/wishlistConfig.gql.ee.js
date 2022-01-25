import { gql } from '@apollo/client';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForWishlistPageEE {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            magento_wishlist_general_is_enabled
            enable_multiple_wishlists
            maximum_multiple_wishlist_number
        }
    }
`;

export default {
    getWishlistConfigQuery: GET_WISHLIST_CONFIG
};
