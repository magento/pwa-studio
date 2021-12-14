import { gql } from '@apollo/client';

import { WishlistPageFragment } from './wishlistFragment.gql';

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
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
