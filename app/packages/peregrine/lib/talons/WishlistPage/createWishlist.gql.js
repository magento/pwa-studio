import { gql } from '@apollo/client';

export const CREATE_WISHLIST = gql`
    mutation createWishlistPage($input: CreateWishlistInput!) {
        createWishlist(input: $input) {
            wishlist {
                id
            }
        }
    }
`;

export default {
    createWishlistMutation: CREATE_WISHLIST
};
