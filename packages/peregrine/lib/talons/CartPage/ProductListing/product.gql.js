import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query getStoreConfig {
        storeConfig {
            id
            product_url_suffix
            configurable_thumbnail_source
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG
};
