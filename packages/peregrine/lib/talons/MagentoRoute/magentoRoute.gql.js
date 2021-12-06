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
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ProductInterface {
                uid
                __typename
            }
            ... on CategoryInterface {
                uid
            }
        }
    }
`;

export default {
    resolveUrlQuery: RESOLVE_URL
};
