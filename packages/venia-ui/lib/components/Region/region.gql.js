import { gql } from '@apollo/client';

export const GET_REGIONS_QUERY = gql`
    query GetRegions($countryCode: String!) {
        country(id: $countryCode) {
            id
            available_regions {
                id
                code
                name
            }
        }
    }
`;
