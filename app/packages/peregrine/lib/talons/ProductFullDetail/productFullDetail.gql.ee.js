import { gql } from '@apollo/client';

import defaultOperations from './productFullDetail.gql.ce';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForProductAC {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            magento_wishlist_general_is_enabled
            enable_multiple_wishlists
        }
    }
`;

export default {
    ...defaultOperations,
    getWishlistConfigQuery: GET_WISHLIST_CONFIG
};
