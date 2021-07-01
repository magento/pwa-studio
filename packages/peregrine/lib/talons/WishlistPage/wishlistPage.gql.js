import { gql } from '@apollo/client';

import { WishlistPageFragment } from './wishlistFragment.gql';

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists {
                id
                ...WishlistPageFragment
            }
        }
    }
    ${WishlistPageFragment}
`;

export default {
    getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
};
