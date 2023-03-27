import { gql } from '@apollo/client';

export const GET_MEGA_MENU = gql`
    query GetMegaMenu {
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
