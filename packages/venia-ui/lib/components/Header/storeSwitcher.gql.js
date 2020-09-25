import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            code
            copyright
            default_display_currency_code
            grid_per_page
            id
            locale
            store_name
        }
    }
`;

// availableStores is not supported in Magento 2.4.0, so the file was added
// to validation ignore list packages/venia-concept/.graphqlconfig
// @todo remove from ignore list when 2.4.1 is released

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
