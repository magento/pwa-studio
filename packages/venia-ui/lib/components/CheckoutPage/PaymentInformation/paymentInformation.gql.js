import gql from 'graphql-tag';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            paymentNonce @client
        }
    }
`;

export const GET_CHECKOUT_STEP = gql`
    query getCheckoutStep($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            checkoutStep @client
        }
    }
`;

/* eslint-enable graphql/template-strings */

export default {
    queries: {
        getPaymentNonceQuery: GET_PAYMENT_NONCE,
        getCheckoutStepQuery: GET_CHECKOUT_STEP
    },
    mutations: {}
};
