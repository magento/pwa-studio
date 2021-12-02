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
    query GetNavigationMenu($id: Int!) {
        category(id: $id) {
            id
            name
            children {
                children_count
                id
                include_in_menu
                name
                position
                url_path
                url_suffix
            }
            include_in_menu
            url_path
        }
    }
`;

export default {
    getNavigationMenuQuery: GET_NAVIGATION_MENU,
    getCategoryUrlSuffixQuery: GET_CATEGORY_URL_SUFFIX
};
