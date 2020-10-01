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

export default {
    mutations: {
        addWishlistItemToCartMutation: ADD_WISHLIST_ITEM_TO_CART
    }
};
