import { gql } from '@apollo/client';

export const GET_ROUTE_DATA = gql`
    query GetRouteData($url: String!) {
        route(url: $url) {
            relative_url
        }
    }
`;

export const GET_AVAILABLE_STORES_DATA = gql`
    query GetAvailableStoresData {
        availableStores {
            default_display_currency_code
            locale
            secure_base_media_url
            store_code
            store_group_code
            store_group_name
            store_name
            store_sort_order
        }
    }
`;

export default {
    getRouteDataQuery: GET_ROUTE_DATA,
    getAvailableStoresDataQuery: GET_AVAILABLE_STORES_DATA
};
