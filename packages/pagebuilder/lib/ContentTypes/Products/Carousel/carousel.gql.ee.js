import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query GetStoreConfigForCarouselEE {
        storeConfig {
            id
            product_url_suffix
            magento_wishlist_general_is_enabled
            enable_multiple_wishlists
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG
};
