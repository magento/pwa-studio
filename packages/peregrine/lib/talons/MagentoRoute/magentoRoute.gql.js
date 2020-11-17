import { gql } from '@apollo/client';

export const RESOLVE_URL = gql`
    query ResolveURL($url: String!) {
        urlResolver(url: $url) {
            id
            relative_url
            redirectCode
            type
        }
    }
`;

export default {
    resolveUrlQuery: RESOLVE_URL
};
