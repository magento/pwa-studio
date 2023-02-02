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
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        categoryList {
            uid
            name
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            children {
                uid
                include_in_menu
                name
                category_icon
                position
                url_path
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                children {
                    uid
                    include_in_menu
                    name
                    category_icon
                    position
                    url_path
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    children {
                        uid
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

export const IS_REQUIRED_LOGIN = gql`
    query isRequiredLogin {
        storeConfig {
            store_code
            is_required_login
        }
    }
`;

export default {
    getMegaMenuQuery: GET_MEGA_MENU,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA,
    getIsRequiredLogin: IS_REQUIRED_LOGIN
};
