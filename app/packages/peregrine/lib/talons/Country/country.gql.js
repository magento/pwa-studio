import { gql } from '@apollo/client';

export const GET_COUNTRIES = gql`
    query GetCountries {
        countries {
            available_regions {
                code
                id
                name
            }
            id
            full_name_english
            two_letter_abbreviation
        }
    }
`;

export default {
    getCountriesQuery: GET_COUNTRIES
};
