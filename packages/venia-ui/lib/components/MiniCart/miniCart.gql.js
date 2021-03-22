import { gql } from '@apollo/client';

import { ProductListFragment } from './ProductList/productList.gql';
import { CartPageFragment } from '../CartPage/cartPageFragments.gql';

export const MiniCartFragment = gql`
    fragment MiniCartFragment on Cart {
        id
        total_quantity
        prices {
            subtotal_excluding_tax {
                currency
                value
            }
        }
        ...ProductListFragment
    }
    ${ProductListFragment}
`;

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
    mutation RemoveItemForMiniCart($cartId: String!, $itemId: Int!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
            @connection(key: "removeItemFromCart") {
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
