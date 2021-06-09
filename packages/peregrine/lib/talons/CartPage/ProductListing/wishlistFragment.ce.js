import { gql } from '@apollo/client';

export const WishlistNameFragment = gql`
    fragment WishlistNameFragment on Wishlist {
        id
    }
`;
