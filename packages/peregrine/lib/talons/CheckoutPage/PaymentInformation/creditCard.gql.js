import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';
import { AvailablePaymentMethodsFragment } from './paymentInformation.gql';

export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query getIsBillingAddressSame($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            isBillingAddressSame
        }
    }
`;

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            paymentNonce
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
                    label
                    region_id
                }
                postcode
                phoneNumber: telephone
            }
        }
    }
`;

export const GET_SHIPPING_ADDRESS = gql`
    query getSelectedShippingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
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
                    label
                    region_id
                }
                postcode
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
        $region: String!
        $postcode: String!
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
                        region: $region
                        postcode: $postcode
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
                        label
                        region_id
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
    getBillingAddressQuery: GET_BILLING_ADDRESS,
    getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
    getPaymentNonceQuery: GET_PAYMENT_NONCE,
    getShippingAddressQuery: GET_SHIPPING_ADDRESS,
    setBillingAddressMutation: SET_BILLING_ADDRESS,
    setCreditCardDetailsOnCartMutation: SET_CC_DETAILS_ON_CART
};
