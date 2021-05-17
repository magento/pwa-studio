import { gql } from '@apollo/client';

import { WishlistFragment } from './wishlistFragment';

export const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        storeConfig {
            id
            configurable_thumbnail_source
        }
    }
`;

export const GET_MULTIPLE_WISHLISTS_ENABLED = gql`
    query getMultipleWishlistsEnabled {
        storeConfig {
            id
            enable_multiple_wishlists
        }
    }
`;

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
                id
                ...WishlistFragment
            }
        }
    }
    ${WishlistFragment}
`;

export default {
    addProductToWishlistMutation: ADD_TO_WISHLIST,
    getMultipleWishlistsEnabledQuery: GET_MULTIPLE_WISHLISTS_ENABLED,
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE
};
