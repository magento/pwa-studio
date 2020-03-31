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
    query getBillingAddress($cartId: String) {
        cart(cart_id: $cartId) {
            id
            billingAddress @client {
                firstName
                lastName
                country
                street1
                street2
                city
                state
                postalCode
            }
        }
    }
`;

/* eslint-enable graphql/template-strings */

export default {
    queries: {
        getBillingAddressQuery: GET_BILLING_ADDRESS,
        getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME
    },
    mutations: {}
};
