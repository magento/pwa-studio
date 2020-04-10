import gql from 'graphql-tag';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */

export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query getIsBillingAddressSame($cartId: String) {
        cart(cart_id: $cartId) {
            id
            isBillingAddressSame @client
        }
    }
`;

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
                country {
                    code
                }
                street
                city
                region {
                    code
                }
                postalCode: postcode
                phoneNumber: telephone
            }
        }
    }
`;

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            paymentNonce @client
        }
    }
`;

/* eslint-enable graphql/template-strings */

export default {
    queries: {
        getBillingAddressQuery: GET_BILLING_ADDRESS,
        getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
        getPaymentNonceQuery: GET_PAYMENT_NONCE
    },
    mutations: {}
};
