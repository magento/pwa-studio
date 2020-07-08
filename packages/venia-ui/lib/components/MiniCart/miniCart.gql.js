import gql from 'graphql-tag';

import { ProductListFragment } from './ProductList/productList.gql';
import { PriceSummaryFragment } from '../CartPage/PriceSummary/priceSummaryFragments';

export const MiniCartFragment = gql`
    fragment MiniCartFragment on Cart {
        id
        total_quantity
        ...ProductListFragment
        ...PriceSummaryFragment
    }
    ${ProductListFragment}
    ${PriceSummaryFragment}
`;

export const MINI_CART_QUERY = gql`
    query MiniCartQuery($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
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
                id
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
