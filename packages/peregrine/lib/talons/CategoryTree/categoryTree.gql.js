import { gql } from '@apollo/client';

export const GET_CATEGORY_URL_SUFFIX = gql`
    query GetStoreConfigForCategoryTree {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix
        }
    }
`;

export const GET_NAVIGATION_MENU = gql`
    query GetNavigationMenu($id: String!) {
        categories(filters: { category_uid: { in: [$id] } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                name
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                children {
                    children_count
                    uid
                    include_in_menu
                    name
                    position
                    url_path
                    url_suffix
                }
                children_count
                include_in_menu
                url_path
            }
        }
    }
`;

export default {
    getNavigationMenuQuery: GET_NAVIGATION_MENU,
    getCategoryUrlSuffixQuery: GET_CATEGORY_URL_SUFFIX
};
