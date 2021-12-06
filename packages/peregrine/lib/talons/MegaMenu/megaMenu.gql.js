import { gql } from '@apollo/client';
export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForMegaMenu {
        storeConfig {
            id
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
                id
                include_in_menu
                name
                position
                url_path
                children {
                    id
                    include_in_menu
                    name
                    position
                    url_path
                    children {
                        id
                        include_in_menu
                        name
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
