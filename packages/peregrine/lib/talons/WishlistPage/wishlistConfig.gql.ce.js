import { gql } from '@apollo/client';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForWishlistPageCE {
        storeConfig {
            id
            magento_wishlist_general_is_enabled
        }
    }
`;

export default {
    getWishlistConfigQuery: GET_WISHLIST_CONFIG
};
