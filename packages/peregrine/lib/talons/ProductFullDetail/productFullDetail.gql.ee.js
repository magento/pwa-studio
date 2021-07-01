import { gql } from '@apollo/client';

import defaultOperations from './productFullDetail.gql.ce';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForProductEE {
        storeConfig {
            id
            magento_wishlist_general_is_enabled
            enable_multiple_wishlists
        }
    }
`;

export default {
    ...defaultOperations,
    getWishlistConfigQuery: GET_WISHLIST_CONFIG
};
