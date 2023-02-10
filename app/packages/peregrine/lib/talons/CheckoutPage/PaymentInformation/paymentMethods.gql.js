import { gql } from '@apollo/client';

export const GET_PAYMENT_METHODS = gql`
    query GetPaymentMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            available_payment_methods {
                code
                title
            }
            selected_payment_method {
                code
            }
        }
    }
`;

export const GET_SELECTED_PAYMENT_METHOD = gql`
    query getSelectedPaymentMethod($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            selected_payment_method {
                code
                title
            }
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $payment_method: PaymentMethodInput!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: $payment_method }) {
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

export default {
    getPaymentMethodsQuery: GET_PAYMENT_METHODS,
    getSelectedPaymentMethodQuery: GET_SELECTED_PAYMENT_METHOD,
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};
