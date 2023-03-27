import { gql } from '@apollo/client';

export const GET_COUNTRIES = gql`
    query GetCountries {
        countries {
            id
            full_name_english
            two_letter_abbreviation
        }
    }
`;

export default {
    getCountriesQuery: GET_COUNTRIES
};
