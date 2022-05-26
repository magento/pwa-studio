import { gql } from '@apollo/client';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';

/**
 * @deprecated - Moved to @magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql
 */
export { MiniCartFragment };

export const MINI_CART_QUERY = gql`
    query MiniCartQuery($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...MiniCartFragment
        }
    }
    ${MiniCartFragment}
`;

export const REMOVE_ITEM_MUTATION = gql`
    mutation RemoveItemForMiniCart($cartId: String!, $itemId: ID!) {
        removeItemFromCart(
            input: { cart_id: $cartId, cart_item_uid: $itemId }
        ) {
            cart {
                id
                ...MiniCartFragment
                ...CartPageFragment
            }
        }
    }
    ${MiniCartFragment}
    ${CartPageFragment}
`;

export default {
    miniCartQuery: MINI_CART_QUERY,
    removeItemMutation: REMOVE_ITEM_MUTATION
};
