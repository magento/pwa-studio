import { gql } from '@apollo/client';

export const MP_STORE_LOCATOR_LOCATIONS = gql`
    query MpStoreLocatorLocations($filter: MpStoreLocatorLocationsFilterInput, $pageSize: Int, $currentPage: Int) {
        MpStoreLocatorLocations(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
            total_count
            items {
                latitude
                longitude
                name
                images
                email
                city
                country
                street
                state_province
                time_zone
                is_config_time_zone
            }
        }
    }
`;

export const GET_LOCATIONS_CART = gql`
    query MpStoreLocatorPickupLocationList($cartId: String!) {
        MpStoreLocatorPickupLocationList(cartId: $cartId) {
            total_count
            items {
                location_id
                latitude
                longitude
                name
                images
                email
                city
                country
                street
                state_province
                time_zone
            }
        }
    }
`;

export const GET_LOCATIONS_HOLIDAYS = gql`
    query MpStoreLocatorConfig($storeId: String! = "1") {
        MpStoreLocatorConfig(storeId: $storeId) {
            locationsData {
                name
                holidayData {
                    from
                    to
                }
            }
        }
    }
`;

export const GET_STOREID = gql`
    query StoreConfig {
        storeConfig {
            id
            store_code
        }
    }
`;

const SUBMIT_LOCATION = gql`
    mutation SaveLocationMpStoreLocator($locationId: String!, $timePickup: String!, $cartId: String) {
        SaveLocationMpStoreLocator(input: { locationId: $locationId, timePickup: $timePickup, cartId: $cartId })
    }
`;

export const GET_LOCALE = gql`
    query {
        storeConfig {
            locale
            store_code
        }
    }
`;

export default {
    getStoreLocations: MP_STORE_LOCATOR_LOCATIONS,
    getLocationsCart: GET_LOCATIONS_CART,
    getLocationHolidays: GET_LOCATIONS_HOLIDAYS,
    submitLocation: SUBMIT_LOCATION,
    getStoreId: GET_STOREID,
    GET_LOCALE
};
