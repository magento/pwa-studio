import gql from 'graphql-tag';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */

export const GET_PAYMENT_DETAILS = gql`
    query getSelectedPaymentMethod($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            paymentNonce @client
            selectedPaymentMethod: selected_payment_method {
                code
            }
        }
    }
`;

export const CLEAR_SELECTED_PAYMENT_METHOD = gql`
    mutation setSelectedPaymentMethod($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: null } }
        ) @connection(key: "setPaymentMethodOnCart") {
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

/* eslint-enable graphql/template-strings */

export default {
    queries: {
        getPaymentDetailsQuery: GET_PAYMENT_DETAILS
    },
    mutations: {
        clearSelectedPaymentMethodOnCart: CLEAR_SELECTED_PAYMENT_METHOD
    }
};
