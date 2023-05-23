import { gql } from '@apollo/client';

import { CartPageFragment } from '../CartPage/cartPageFragments.gql';
import { CartTriggerFragment } from '../Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '../MiniCart/miniCartFragments.gql';
import { ProductFormFragment } from './productFullDetailFragment.gql';

/**
 * @deprecated - replaced by general mutation in @magento/peregrine/lib/talons/productFullDetail.js
 */
export const ADD_CONFIGURABLE_PRODUCT_TO_CART = gql`
    mutation AddConfigurableProductToCart($cartId: String!, $quantity: Float!, $sku: String!, $parentSku: String!) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $sku }, parent_sku: $parentSku }]
            }
        ) {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

export const ADD_PRODUCT_TO_CART = gql`
    mutation AddProductToCart($cartId: String!, $product: CartItemInput!) {
        addProductsToCart(cartId: $cartId, cartItems: [$product]) {
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

/**
 * @deprecated - replaced by general mutation in @magento/peregrine/lib/talons/productFullDetail.js
 */
export const ADD_SIMPLE_PRODUCT_TO_CART = gql`
    mutation AddSimpleProductToCart($cartId: String!, $quantity: Float!, $sku: String!) {
        addSimpleProductsToCart(
            input: { cart_id: $cartId, cart_items: [{ data: { quantity: $quantity, sku: $sku } }] }
        ) {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

const GET_PRODUCT_DETAIL_FOR_CONFIGURABLE_OPTIONS_BY_SKU = gql`
    query GetProductDetailForConfigurableOptionsBySku($sku: String) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                uid
                ...ProductFormFragment
            }
        }
    }
    ${ProductFormFragment}
`;

const UPDATE_CONFIGURABLE_OPTIONS = gql`
    mutation UpdateConfigurableOptions(
        $cartId: String!
        $cartItemId: ID!
        $parentSku: String!
        $variantSku: String!
        $quantity: Float!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $variantSku }, parent_sku: $parentSku }]
            }
        ) {
            cart {
                id
            }
        }

        removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $cartItemId }) {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export default {
    addConfigurableProductToCartMutation: ADD_CONFIGURABLE_PRODUCT_TO_CART,
    addProductToCartMutation: ADD_PRODUCT_TO_CART,
    addSimpleProductToCartMutation: ADD_SIMPLE_PRODUCT_TO_CART,
    getProductDetailForConfigurableOptionsBySkuQuery: GET_PRODUCT_DETAIL_FOR_CONFIGURABLE_OPTIONS_BY_SKU,
    updateConfigurableOptionsMutation: UPDATE_CONFIGURABLE_OPTIONS
};
