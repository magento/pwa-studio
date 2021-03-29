import { gql } from '@apollo/client';

export const ADD_TO_WISHLIST = gql`
    mutation addProductToWishlist(
        $wishlistId: ID!
        $itemOptions: WishlistItemInput!
    ) {
        addProductsToWishlist(
            wishlistId: $wishlistId
            wishlistItems: [$itemOptions]
        ) {
            user_errors {
                code
                message
            }
        }
    }
`;
export default {
    addProductToWishlistMutation: ADD_TO_WISHLIST
};
