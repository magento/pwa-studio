import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query GetStoreConfigForCarouselCE {
        storeConfig {
            id
            product_url_suffix
            magento_wishlist_general_is_enabled
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG
};
