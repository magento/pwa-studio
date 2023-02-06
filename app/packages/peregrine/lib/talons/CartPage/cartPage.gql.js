import { gql } from '@apollo/client';

import { CartPageFragment } from './cartPageFragments.gql';
import { CheckoutPageFragment } from '../CheckoutPage/checkoutPageFragments.gql';

export const IS_USER_AUTHED = gql`
    query IsUserAuthed($cartId: String!) {
        cart(cart_id: $cartId) {
            # The purpose of this query is to check that the user is authorized
            # to query on the current cart. Just fetch "id" to keep it small.
            id
        }
    }
`;

export const CREATE_CART = gql`
    mutation CreateCart {
        cartId: createEmptyCart
    }
`;

export const GET_CART_DETAILS = gql`
    query GetCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                uid
                prices {
                    price {
                        value
                    }
                }
                product {
                    uid
                    name
                    sku
                    small_image {
                        url
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
                quantity
                ... on ConfigurableCartItem {
                    configurable_options {
                        configurable_product_option_uid
                        option_label
                        configurable_product_option_value_uid
                        value_label
                    }
                }
            }
            prices {
                grand_total {
                    value
                    currency
                }
            }
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;

export const MERGE_CARTS = gql`
    mutation MergeCarts($sourceCartId: String!, $destinationCartId: String!) {
        mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId) {
            id
            items {
                uid
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export default {
    IsUserAuthedQuery: IS_USER_AUTHED,
    createCartMutation: CREATE_CART,
    getCartDetailsQuery: GET_CART_DETAILS,
    mergeCartsMutation: MERGE_CARTS
};
