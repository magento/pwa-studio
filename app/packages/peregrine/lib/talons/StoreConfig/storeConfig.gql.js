import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            code
            id
            locale
            product_url_suffix
            store_code
            store_group_name
            store_name
        }
    }
`;
