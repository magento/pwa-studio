import { gql } from '@apollo/client';

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "banktransfer" } })
            @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export const GET_CONFIG_DETAILS = gql`
    query getStoreConfig {
        storeConfig {
            store_code
            bank_transfer {
                instructions
            }
        }
    }
`;

export default {
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART,
    getStoreConfig: GET_CONFIG_DETAILS
};
