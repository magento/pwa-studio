import { gql } from '@apollo/client';

import { WishlistFragment } from './wishlistFragment.gql';

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists {
                ...WishlistFragment
            }
        }
    }
    ${WishlistFragment}
`;

export default {
    getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
};
