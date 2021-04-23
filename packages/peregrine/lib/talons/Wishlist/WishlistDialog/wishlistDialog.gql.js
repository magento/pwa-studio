import { gql } from '@apollo/client';

export const GET_WISHLISTS = gql`
    query getWishlistsDialogData {
        storeConfig {
            id
            enable_multiple_wishlists
            maximum_number_of_wishlists
        }
        customer {
            id
            wishlists {
                id
                name
            }
        }
    }
`;

export default {
    getWishlistsQuery: GET_WISHLISTS
};
