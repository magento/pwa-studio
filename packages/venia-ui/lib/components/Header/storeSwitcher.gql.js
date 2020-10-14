import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            id
            code
            store_name
        }
    }
`;

export const GET_AVAILABLE_STORES_DATA = gql`
    query getAvailableStoresData {
        availableStores {
            code
            default_display_currency_code
            id
            locale
            store_name
        }
    }
`;

export default {
    queries: {
        getStoreConfigData: GET_STORE_CONFIG_DATA,
        getAvailableStoresData: GET_AVAILABLE_STORES_DATA
    }
};
