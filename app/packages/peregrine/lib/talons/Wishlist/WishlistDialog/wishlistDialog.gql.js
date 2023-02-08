import { gql } from '@apollo/client';

export const ADD_TO_WISHLIST = gql`
    mutation addProductToWishlist($wishlistId: ID!, $itemOptions: WishlistItemInput!) {
        addProductsToWishlist(wishlistId: $wishlistId, wishlistItems: [$itemOptions]) {
            user_errors {
                code
                message
            }
            wishlist {
                id
                name
            }
        }
    }
`;

export const GET_WISHLISTS = gql`
    query getWishlistsDialogData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            wishlists {
                id
                name
            }
        }
    }
`;
export default {
    addProductToWishlistMutation: ADD_TO_WISHLIST,
    getWishlistsQuery: GET_WISHLISTS
};
