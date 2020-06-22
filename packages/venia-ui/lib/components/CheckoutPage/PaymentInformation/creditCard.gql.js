import gql from 'graphql-tag';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments';
import { AvailablePaymentMethodsFragment } from './paymentInformation.gql';

// We disable linting for local fields because there is no way to add them to
// the fetched schema. Additionally, since we don't want to make a network call
// for "id" we disable "required-fields"
// https://github.com/apollographql/eslint-plugin-graphql/issues/99

/* eslint-disable graphql/template-strings */
/* eslint-disable graphql/required-fields */
export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query getIsBillingAddressSame($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            isBillingAddressSame @client
        }
    }
`;

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            paymentNonce @client
        }
    }
`;

/* eslint-enable graphql/required-fields */
/* eslint-enable graphql/template-strings */

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
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

export const GET_SHIPPING_ADDRESS = gql`
    query getSelectedShippingAddress($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            shippingAddresses: shipping_addresses {
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
        ) @connection(key: "setBillingAddressOnCart") {
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
                ...PriceSummaryFragment
                ...AvailablePaymentMethodsFragment
            }
        }
    }
    ${PriceSummaryFragment}
    ${AvailablePaymentMethodsFragment}
`;

export const SET_CC_DETAILS_ON_CART = gql`
    mutation setSelectedPaymentMethod(
        $cartId: String!
        $paymentNonce: String!
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "braintree"
                    braintree: {
                        payment_method_nonce: $paymentNonce
                        is_active_payment_token_enabler: false
                    }
                }
            }
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

export default {
    queries: {
        getBillingAddressQuery: GET_BILLING_ADDRESS,
        getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
        getPaymentNonceQuery: GET_PAYMENT_NONCE,
        getShippingAddressQuery: GET_SHIPPING_ADDRESS
    },
    mutations: {
        setBillingAddressMutation: SET_BILLING_ADDRESS,
        setCreditCardDetailsOnCartMutation: SET_CC_DETAILS_ON_CART
    }
};
