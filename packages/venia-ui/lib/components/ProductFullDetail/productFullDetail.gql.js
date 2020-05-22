import gql from 'graphql-tag';

import { CartPageFragment } from '../CartPage/cartPageFragments.gql';

export const ADD_CONFIGURABLE_MUTATION = gql`
    mutation addConfigurableProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
        $parentSku: String!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $sku }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
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

export const ADD_SIMPLE_MUTATION = gql`
    mutation addSimpleProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
    ) {
        addSimpleProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $sku } }]
            }
        ) @connection(key: "addSimpleProductsToCart") {
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
