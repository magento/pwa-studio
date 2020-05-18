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

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            paymentNonce @client
        }
    }
`;

/* eslint-enable graphql/template-strings */

export default {
    queries: {
        getPaymentDetailsQuery: GET_PAYMENT_DETAILS,
        getPaymentNonceQuery: GET_PAYMENT_NONCE
    },
    mutations: {}
};
