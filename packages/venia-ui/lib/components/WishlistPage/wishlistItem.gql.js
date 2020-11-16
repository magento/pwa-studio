import { gql } from '@apollo/client';

import { CartTriggerFragment } from '../Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '../MiniCart/miniCart.gql';

export const ADD_WISHLIST_ITEM_TO_CART = gql`
    mutation AddWishlistItemToCart(
        $cartId: String!
        $cartItem: ConfigurableProductCartItemInput!
    ) {
        addConfigurableProductsToCart(
            input: { cart_id: $cartId, cart_items: [$cartItem] }
        ) {
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

export const REMOVE_PRODUCTS_FROM_WISHLIST = gql`
    mutation RemoveProductsFromWishlist(
        $wishlistId: ID!
        $wishlistItemsId: [ID!]!
    ) {
        removeProductsFromWishlist(
            wishlistId: $wishlistId
            wishlistItemsIds: $wishlistItemsId
        ) {
            wishlist {
                id
                items_count
                items_v2 {
                    id
                    product {
                        id
                        image {
                            label
                            url
                        }
                        name
                        price_range {
                            maximum_price {
                                final_price {
                                    currency
                                    value
                                }
                            }
                        }
                        sku
                    }
                    ... on ConfigurableWishlistItem {
                        child_sku
                        configurable_options {
                            id
                            option_label
                            value_label
                        }
                    }
                }
                name
                sharing_code
            }
        }
    }
`;

export default {
    addWishlistItemToCartMutation: ADD_WISHLIST_ITEM_TO_CART,
    removeProductsFromWishlistMutation: REMOVE_PRODUCTS_FROM_WISHLIST
};
