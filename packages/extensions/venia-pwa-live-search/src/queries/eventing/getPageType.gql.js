import { gql } from '@apollo/client';

export const RESOLVE_PAGE_TYPE = gql`
    query ResolveURL($url: String!) {
        urlResolver(url: $url) {
            id
            type
        }
    }
`;

export default {
    resolvePagetypeQuery: RESOLVE_PAGE_TYPE
};
