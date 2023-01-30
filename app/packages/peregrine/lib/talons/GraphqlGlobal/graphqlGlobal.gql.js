import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            product_url_suffix
            store_code
            store_name
            store_group_name
            id
            code
            store_group_name
            locale
        }
    }
`;
