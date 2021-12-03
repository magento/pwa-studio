import { gql } from '@apollo/client';

import { WishlistPageFragment } from './wishlistFragment.gql';
import { WishlistItemFragment } from './wishlistItemFragments.gql';

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

export const GET_CUSTOMER_WISHLIST_ITEMS = gql`
    query getCustomerWishlist($id: ID!, $currentPage: Int) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            wishlist_v2(id: $id) {
                id
                items_v2(currentPage: $currentPage) {
                    items {
                        id
                        ...WishlistItemFragment
                    }
                }
            }
        }
    }
    ${WishlistItemFragment}
`;

export const UPDATE_WISHLIST = gql`
    mutation UpdateWishlist(
        $name: String!
        $visibility: WishlistVisibilityEnum!
        $wishlistId: ID!
    ) {
        updateWishlist(
            name: $name
            visibility: $visibility
            wishlistId: $wishlistId
        ) {
            name
            uid
            visibility
        }
    }
`;

export default {
    getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST,
    getCustomerWishlistItems: GET_CUSTOMER_WISHLIST_ITEMS,
    updateWishlistMutation: UPDATE_WISHLIST
};
