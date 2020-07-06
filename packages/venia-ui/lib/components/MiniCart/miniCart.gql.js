import gql from 'graphql-tag';

import { ProductListFragment } from './ProductList/productList.gql';

export const MiniCartFragment = gql`
    fragment MiniCartFragment on Cart {
        id
        total_quantity
        ...ProductListFragment
    }
    ${ProductListFragment}
`;

export const MINI_CART_QUERY = gql`
    query MiniCartQuery($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            ...MiniCartFragment
        }
    }
    ${MiniCartFragment}
`;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: Int!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
            @connection(key: "removeItemFromCart") {
            cart {
                ...MiniCartFragment
            }
        }
    }
    ${MiniCartFragment}
`;

export default {
    queries: {
        miniCartQuery: MINI_CART_QUERY
    },
    mutations: {
        removeItemMutation: REMOVE_ITEM_MUTATION
    }
};
