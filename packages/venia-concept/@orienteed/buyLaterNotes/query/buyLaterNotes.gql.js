import { gql } from '@apollo/client';

export const GET_CONFIG_DETAILS = gql`
    query getConfigDetails {
        mpSaveCartConfigs {
            enabled
            button_title
            allow_share
            show_button_guest
        }
    }
`;

export const GET_SAVED_CARTS = gql`
    query getSaveCarts($pageSize: Int, $currentPage: Int) {
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
                }
            }
        }
    }
`;

export const DELETE_SAVE_CART = gql`
    mutation deleteSaveCart($token: String!) {
        mpSaveCartDeleteCart(token: $token)
    }
`;

export const RESTORE_SAVE_CART = gql`
    mutation restoreSaveCart($cartId: String!, $token: String!) {
        mpSaveCartRestoreCart(cart_id: $cartId, token: $token)
    }
`;

export const CART_DETAILS_QUERY = gql`
    query getCartId($cartId: String!) {
        cart(cart_id: $cartId) {
            # The purpose of this query is to check that the user is authorized
            # to query on the current cart. Just fetch "id" to keep it small.
            id
        }
    }
`;

export const SHARE_CART = gql`
    mutation getShareCart($cartId: String!, $token: String!) {
        mpSaveCartShareCart(cart_id: $cartId, token: $token)
    }
`;
