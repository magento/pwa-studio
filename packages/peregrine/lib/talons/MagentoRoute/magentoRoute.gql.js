import { gql } from '@apollo/client';

export const GET_STORE_CODE = gql`
    query GetStoreCode {
        storeConfig {
            id
            code
        }
    }
`;

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
    getStoreCodeQuery: GET_STORE_CODE,
    resolveUrlQuery: RESOLVE_URL
};
