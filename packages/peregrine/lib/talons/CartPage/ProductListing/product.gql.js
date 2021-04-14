import { gql } from '@apollo/client';

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
                items: items_v2 {
                    items {
                        id
                        ... on ConfigurableWishlistItem {
                            configurable_options {
                                id
                                value_id
                                option_label
                                value_label
                            }
                        }
                        product {
                            sku
                        }
                    }
                }
            }
        }
    }
`;

export const REMOVE_FROM_WISHLIST = gql`
    mutation RemoveProductFromWishlist($wishlistId: ID!, $wishlistItemId: ID!) {
        removeProductsFromWishlist(
            wishlistId: $wishlistId
            wishlistItemsIds: [$wishlistItemId]
        ) {
            wishlist {
                id
            }
        }
    }
`;

export default {
    addProductToWishlistMutation: ADD_TO_WISHLIST,
    getMultipleWishlistsEnabledQuery: GET_MULTIPLE_WISHLISTS_ENABLED,
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE,
    removeProductFromWishlistMutation: REMOVE_FROM_WISHLIST
};
