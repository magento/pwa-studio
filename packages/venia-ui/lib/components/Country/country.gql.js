import { gql } from '@apollo/client';

export const GET_COUNTRIES_QUERY = gql`
    query GetCountries {
        countries {
            id
            full_name_english
            two_letter_abbreviation
        }
    }
`;
