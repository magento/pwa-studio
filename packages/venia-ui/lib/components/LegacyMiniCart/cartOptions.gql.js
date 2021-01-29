import { gql } from '@apollo/client';

import { CartPageFragment } from '../CartPage/cartPageFragments.gql';

export const REMOVE_ITEM_MUTATION = gql`
    mutation RemoveItemForOptions($cartId: String!, $itemId: Int!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
            @connection(key: "removeItemFromCart") {
            cart {
                id
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const UPDATE_ITEM_MUTATION = gql`
    mutation updateItemInCart(
        $cartId: String!
        $itemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $itemId, quantity: $quantity }]
            }
        ) @connection(key: "updateCartItems") {
            cart {
                id
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;
