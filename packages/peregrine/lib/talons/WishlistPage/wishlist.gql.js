import { gql } from '@apollo/client';

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists {
                id
                name
                visibility
            }
        }
    }
`;

export const UPDATE_WISHLIST = gql`
    mutation UpdateWishlist(
        $name: String!
        $visibility: WishlistVisibilityEnum!
        $wishlistId: ID!
    ) {
        updateWishlist(
            name: $name
            visibility: $visibility
            wishlistId: $wishlistId
        ) {
            name
            uid
            visibility
        }
    }
`;

export default {
    getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST,
    updateWishlistMutation: UPDATE_WISHLIST
};
