import { gql } from '@apollo/client';

export const DELETE_SAVED_CARTS = gql`
    mutation DeleteSavedCarts($token: String!) {
        mpSaveCartDeleteCart(token: $token)
    }
`;

export const GET_CONFIG_DETAILS = gql`
    query GetConfigDetailsForSavedCarts {
        mpSaveCartConfigs {
            enabled
            button_title
            allow_share
            show_button_guest
        }
    }
`;

export const GET_SAVED_CARTS = gql`
    query GetSavedCarts($pageSize: Int, $currentPage: Int) {
        mpSaveCartGetCarts(currentPage: $currentPage, pageSize: $pageSize) {
            total_count
            page_info {
                current_page
                page_size
            }
            items {
                cart_id
                created_at
                cart_name
                description
                share_url
                token
                cart_total {
                    currency
                    value
                }
                items {
                    cart_id
                    cart_item_id
                    product_name
                    image
                    price
                    qty
                    sku
                    subtotal_converted
                    attribute_labels_and_values {
                        label
                        value
                        __typename
                    }
                }
            }
        }
    }
`;

export const RESTORE_SAVED_CARTS = gql`
    mutation RestoreSavedCarts($cartId: String!, $token: String!) {
        mpSaveCartRestoreCart(cart_id: $cartId, token: $token)
    }
`;

export const SAVE_CART = gql`
    mutation SaveSavedCarts($cartId: String!, $cartName: String!, $description: String) {
        o_mpSaveCart(cart_id: $cartId, cart_name: $cartName, description: $description)
    }
`;

export const SHARE_CART = gql`
    mutation ShareSavedCarts($cartId: String!, $token: String!) {
        mpSaveCartShareCart(cart_id: $cartId, token: $token)
    }
`;

export default {
    deleteSavedCartsMutation: DELETE_SAVED_CARTS,
    getConfigDetailsForSavedCartsQuery: GET_CONFIG_DETAILS,
    getSavedCartsQuery: GET_SAVED_CARTS,
    restoreSavedCartsMutation: RESTORE_SAVED_CARTS,
    saveSavedCartsMutation: SAVE_CART,
    shareSavedCartsMutation: SHARE_CART
};
