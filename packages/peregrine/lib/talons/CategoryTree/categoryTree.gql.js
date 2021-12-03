import { gql } from '@apollo/client';

export const GET_CATEGORY_URL_SUFFIX = gql`
    query GetStoreConfigForCategoryTree {
        storeConfig {
            id
            category_url_suffix
        }
    }
`;

export const GET_NAVIGATION_MENU = gql`
    query GetNavigationMenu($id: String!) {
        categories(filters: { ids: { in: [$id] } }) {
            items {
                id
                uid
                name
                children {
                    children_count
                    id
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
