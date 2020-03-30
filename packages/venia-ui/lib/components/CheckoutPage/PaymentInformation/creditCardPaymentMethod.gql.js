import gql from 'graphql-tag';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */

export const GET_ALL_COUNTRIES = gql`
    query getAllCountries {
        countries {
            available_regions {
                code
                id
                name
            }
            id
        }
    }
`;

/* eslint-enable graphql/template-strings */

export default {
    queries: {
        getAllCountriesQuery: GET_ALL_COUNTRIES
    },
    mutations: {}
};
