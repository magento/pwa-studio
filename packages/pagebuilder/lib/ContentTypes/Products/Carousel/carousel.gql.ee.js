import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query GetStoreConfigForCarouselAC {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
            magento_wishlist_general_is_enabled
            enable_multiple_wishlists
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG
};
