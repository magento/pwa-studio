import { gql } from '@apollo/client';

export const RESOLVE_URL = gql`
    query ResolveURL($url: String!) {
        route(url: $url) {
            relative_url
            redirect_code
            type
            ... on CmsPage {
                identifier
            }
            ... on ProductInterface {
                uid
                __typename
            }
            ... on CategoryInterface {
                id
            }
        }
    }
`;

export default {
    resolveUrlQuery: RESOLVE_URL
};
