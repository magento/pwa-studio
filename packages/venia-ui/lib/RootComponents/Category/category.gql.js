import { gql } from '@apollo/client';

export const GET_PAGE_SIZE = gql`
    query getPageSize {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            grid_per_page
            category_url_suffix
            category_canonical_tag
        }
    }
`;

export default {
    queries: {
        getPageSize: GET_PAGE_SIZE
    }
};
