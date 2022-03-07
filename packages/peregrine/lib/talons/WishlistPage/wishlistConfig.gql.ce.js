import { gql } from '@apollo/client';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForWishlistPageMOS {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            magento_wishlist_general_is_enabled
        }
    }
`;

export default {
    getWishlistConfigQuery: GET_WISHLIST_CONFIG
};
