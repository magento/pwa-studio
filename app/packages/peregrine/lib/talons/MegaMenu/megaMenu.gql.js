import { gql } from '@apollo/client';

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

export default {
    getMegaMenuQuery: GET_MEGA_MENU
};
