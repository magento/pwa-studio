import gql from 'graphql-tag';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */

export const GET_ALL_COUNTRIES = gql`
    query getAllCountries {
        countries {
            available_regions {
                code
                id
                name
            }
            id
        }
    }
`;

export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query getIsBillingAddressSame($cartId: String) {
        cart(cart_id: $cartId) {
            id
            isBillingAddressSame @client
        }
    }
`;

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String) {
        cart(cart_id: $cartId) {
            id
            billingAddress @client {
                firstName
                lastName
                street1
                street2
                city
                state
                postalCode
                phoneNumber
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
        getAllCountriesQuery: GET_ALL_COUNTRIES,
        getBillingAddressQuery: GET_BILLING_ADDRESS,
        getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
        getPaymentNonceQuery: GET_PAYMENT_NONCE
    },
    mutations: {}
};
