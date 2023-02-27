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
