import { gql } from '@apollo/client';

/* https://devdocs.magento.com/guides/v2.4/graphql/mutations/create-wishlist.html */
export const CREATE_WISHLIST = gql`
    mutation createWishlist(
        $name: String!
        $visibility: WishlistVisibilityEnum!
    ) {
        createWishlist(input: { name: $name, visibility: $visibility }) {
            wishlist {
                id
            }
        }
    }
`;

export default {
    createWishlistMutation: CREATE_WISHLIST
};
