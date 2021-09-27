import { gql } from '@apollo/client';
import { CartPageFragment } from '../../cartPageFragments.gql';
import { ProductFormFragment } from './productFormFragment.gql';

export const GET_CONFIGURABLE_OPTIONS = gql`
    query productDetailBySku($sku: String) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                ...ProductFormFragment
            }
        }
    }
    ${ProductFormFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation UpdateCartItemQuantity(
        $cartId: String!
        $cartItemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $cartItemId, quantity: $quantity }]
            }
        ) @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const UPDATE_CONFIGURABLE_OPTIONS_MUTATION = gql`
    mutation UpdateConfigurableOptions(
        $cartId: String!
        $cartItemId: Int!
        $parentSku: String!
        $variantSku: String!
        $quantity: Float!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $variantSku }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
            }
        }

        removeItemFromCart(
            input: { cart_id: $cartId, cart_item_id: $cartItemId }
        ) @connection(key: "removeItemFromCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export default {
    getConfigurableOptionsQuery: GET_CONFIGURABLE_OPTIONS,
    updateQuantityMutation: UPDATE_QUANTITY_MUTATION,
    updateConfigurableOptionsMutation: UPDATE_CONFIGURABLE_OPTIONS_MUTATION
};
