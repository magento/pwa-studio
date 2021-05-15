import { gql } from '@apollo/client';

export const WishlistFragment = gql`
    fragment WishlistFragment on Wishlist {
        id
    }
`;
