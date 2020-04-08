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
    query getIsBillingAddressSame($cartId: String!) {
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

export const SET_BILLING_ADDRESS = gql`
    mutation setBillingAddress(
        $cartId: String!
        $firstName: String!
        $lastName: String!
        $street1: String!
        $street2: String
        $city: String!
        $state: String!
        $postalCode: String!
        $country: String!
        $phoneNumber: String!
    ) {
        setBillingAddressOnCart(
            input: {
                cart_id: $cartId
                billing_address: {
                    address: {
                        firstname: $firstName
                        lastname: $lastName
                        street: [$street1, $street2]
                        city: $city
                        region: $state
                        postcode: $postalCode
                        country_code: $country
                        telephone: $phoneNumber
                        save_in_address_book: false
                    }
                }
            }
        ) {
            cart {
                id
                billing_address {
                    firstname
                    lastname
                    country {
                        code
                    }
                    street
                    city
                    region {
                        code
                    }
                    postcode
                    telephone
                }
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
    mutations: {
        setBillingAddressMutation: SET_BILLING_ADDRESS
    }
};
