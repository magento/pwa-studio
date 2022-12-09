import { gql } from '@apollo/client';
export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForMegaMenu {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix
        }
    }
`;

export const GET_MEGA_MENU = gql`
    query getMegaMenu {
        categoryList {
            uid
            name
            children {
                uid
                include_in_menu
                name
                category_icon
                position
                url_path
                children {
                    uid
                    include_in_menu
                    name
                    category_icon
                    position
                    url_path
                    children {
                        id
                        include_in_menu
                        name
                        category_icon
                        position
                        url_path
                    }
                }
            }
        }
    }
`;

export default {
    getMegaMenuQuery: GET_MEGA_MENU,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
