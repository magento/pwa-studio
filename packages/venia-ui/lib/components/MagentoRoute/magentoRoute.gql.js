import gql from 'graphql-tag';

export const RESOLVE_URL = gql`
    query resolveUrl($urlKey: String!) {
        urlResolver(url: $urlKey) {
            type
            id
        }
    }
`;
