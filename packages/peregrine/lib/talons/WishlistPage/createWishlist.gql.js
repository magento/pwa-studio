import { gql } from '@apollo/client';

export const CREATE_WISHLIST = gql`
    mutation createWishlist($input: CreateWishlistInput!) {
        createWishlist(input: $input) {
            wishlist {
                id
                items_count
                name
                visibility
                sharing_code
            }
        }
    }
`;

export const GET_CUSTOMER_WISHLISTS = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists {
                id
                items_count
                name
                visibility
                sharing_code
            }
        }
    }
`;

export default {
    createWishlistMutation: CREATE_WISHLIST,
    getCustomerWishlistsQuery: GET_CUSTOMER_WISHLISTS
};
