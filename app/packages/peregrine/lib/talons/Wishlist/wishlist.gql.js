import { gql } from '@apollo/client';

import { CartTriggerFragment } from '@magento/peregrine/lib/talons/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';
import { WishlistItemFragment } from './wishlistItemFragments.gql';
import { WishlistPageFragment } from './wishlistFragment.gql.ce';

export const ADD_PRODUCT_TO_WISHLIST = gql`
    mutation AddProductToWishlist($wishlistId: ID!, $itemOptions: WishlistItemInput!) {
        addProductsToWishlist(wishlistId: $wishlistId, wishlistItems: [$itemOptions]) {
            user_errors {
                code
                message
            }
        }
    }
`;

export const ADD_WISHLIST_PRODUCT_TO_CART = gql`
    mutation AddWishlistProductToCart($cartId: String!, $cartItem: CartItemInput!) {
        addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
            cart {
                id
                ...CartTriggerFragment
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

export const CREATE_WISHLIST = gql`
    mutation createWishlist($input: CreateWishlistInput!) {
        createWishlist(input: $input) {
            wishlist {
                id
            }
        }
    }
`;

export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query GetProductsInWishlistsForGallery {
        customerWishlistProducts @client
    }
`;

export const GET_WISHLIST_PRODUCTS = gql`
    query GetWishlistProducts($id: ID!, $currentPage: Int) {
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

export const GET_WISHLISTS = gql`
    query GetWishlists {
        customer {
            wishlists {
                ...WishlistPageFragment
            }
        }
    }
    ${WishlistPageFragment}
`;

export const REMOVE_PRODUCTS_FROM_WISHLIST = gql`
    mutation RemoveProductsFromWishlist($wishlistId: ID!, $wishlistItemsId: [ID!]!) {
        removeProductsFromWishlist(wishlistId: $wishlistId, wishlistItemsIds: $wishlistItemsId) {
            wishlist {
                id
                ...WishlistPageFragment
            }
        }
    }
    ${WishlistPageFragment}
`;

export const UPDATE_WISHLIST = gql`
    mutation UpdateWishlist($name: String!, $visibility: WishlistVisibilityEnum!, $wishlistId: ID!) {
        updateWishlist(name: $name, visibility: $visibility, wishlistId: $wishlistId) {
            name
            uid
            visibility
        }
    }
`;

export default {
    addProductToWishlistMutation: ADD_PRODUCT_TO_WISHLIST,
    addWishlistProductToCartMutation: ADD_WISHLIST_PRODUCT_TO_CART,
    createWishlistMutation: CREATE_WISHLIST,
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS,
    getWishlistProductsQuery: GET_WISHLIST_PRODUCTS,
    getWishlistsQuery: GET_WISHLISTS,
    removeProductsFromWishlistMutation: REMOVE_PRODUCTS_FROM_WISHLIST,
    updateWishlistMutation: UPDATE_WISHLIST
};
