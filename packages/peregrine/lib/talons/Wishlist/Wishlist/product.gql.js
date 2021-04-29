import { gql } from '@apollo/client';

import { WishlistFragment } from './wishlistFragment';

export const ADD_TO_WISHLIST = gql`
    mutation addProductToWishlist(
        $wishlistId: ID!
        $itemOptions: WishlistItemInput!
    ) {
        addProductsToWishlist(
            wishlistId: $wishlistId
            wishlistItems: [$itemOptions]
        ) {
            user_errors {
                code
                message
            }
            wishlist {
                ...WishlistFragment
            }
        }
    }
    ${WishlistFragment}
`;

export const GET_MULTIPLE_WISHLISTS_ENABLED = gql`
    query getWishlistsDialogData {
        storeConfig {
            id
            enable_multiple_wishlists
            maximum_number_of_wishlists
        }
        customer {
            id
            wishlists {
                id
                name
            }
        }
    }
`;

export default {
    addProductToWishlistMutation: ADD_TO_WISHLIST,
    getMultipleWishlistsEnabledQuery: GET_MULTIPLE_WISHLISTS_ENABLED
};
