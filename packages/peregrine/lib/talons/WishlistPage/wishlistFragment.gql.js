import { gql } from '@apollo/client';

export const WishlistFragment = gql`
    fragment WishlistFragment on Wishlist {
        id
        items_count
        sharing_code
    }
`;
