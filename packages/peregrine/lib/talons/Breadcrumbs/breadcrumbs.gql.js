import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForBreadcrumbs {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix
        }
    }
`;

export const GET_BREADCRUMBS = gql`
    query GetBreadcrumbs($category_id: String!) {
        categories(filters: { category_uid: { in: [$category_id] } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                breadcrumbs {
                    category_uid
                    # We may not need level if \`breadcrumbs\` is sorted.
                    category_level
                    category_name
                    category_url_path
                }
                uid
                name
                url_path
            }
        }
    }
`;

export default {
    getBreadcrumbsQuery: GET_BREADCRUMBS,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
