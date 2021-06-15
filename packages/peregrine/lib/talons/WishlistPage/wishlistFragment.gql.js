import { gql } from '@apollo/client';

import { WishlistItemFragment } from './wishlistItemFragments.gql';

export const WishlistPageFragment = gql`
    fragment WishlistPageFragment on Wishlist {
        id
        items_count
        sharing_code
    }
`;

export const WishlistFragment = gql`
    fragment WishlistFragment on Wishlist {
        id
        items_count
        sharing_code
        items_v2 {
            items {
                id
                ...WishlistItemFragment
            }
        }
    }
    ${WishlistItemFragment}
`;
