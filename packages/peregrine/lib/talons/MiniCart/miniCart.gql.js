import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigForMiniCart {
        storeConfig {
            id
            product_url_suffix
            configurable_thumbnail_source
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
