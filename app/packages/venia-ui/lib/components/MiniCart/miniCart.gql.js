import { gql } from '@apollo/client';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';

export const GET_MINI_CART = gql`
    query GetMiniCartQuery($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...MiniCartFragment
        }
    }
    ${MiniCartFragment}
`;

export const REMOVE_ITEM_MUTATION = gql`
    mutation RemoveItemForMiniCart($cartId: String!, $itemId: ID!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $itemId }) {
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
    getMiniCartQuery: GET_MINI_CART,
    removeItemMutation: REMOVE_ITEM_MUTATION
};
