import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';
import { AvailablePaymentMethodsFragment } from '../PaymentInformation/paymentInformation.gql';

export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query GetIsBillingAddressSame($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            isBillingAddressSame
        }
    }
`;

export const GET_BILLING_ADDRESS = gql`
    query GetBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
                country {
                    code
                    label
                }
                street
                city
                region {
                    code
                    label
                }
                postcode
                phoneNumber: telephone
            }
        }
    }
`;

export const SET_BILLING_ADDRESS = gql`
    mutation SetBillingAddress(
        $cartId: String!
        $firstName: String!
        $lastName: String!
        $street: [String]!
        $city: String!
        $regionCode: String!
        $postCode: String!
        $countryCode: String!
        $phoneNumber: String!
    ) {
        setBillingAddressOnCart(
            input: {
                cart_id: $cartId
                billing_address: {
                    address: {
                        firstname: $firstName
                        lastname: $lastName
                        street: $street
                        city: $city
                        region: $regionCode
                        postcode: $postCode
                        country_code: $countryCode
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

export const SET_DEFAULT_BILLING_ADDRESS = gql`
    mutation SetDefaultBillingAddress($cartId: String!, $customerAddressId: Int) {
        setBillingAddressOnCart(
            input: { cart_id: $cartId, billing_address: { customer_address_id: $customerAddressId } }
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

export default {
    getBillingAddressQuery: GET_BILLING_ADDRESS,
    getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
    setBillingAddressMutation: SET_BILLING_ADDRESS,
    setDefaultBillingAddressMutation: SET_DEFAULT_BILLING_ADDRESS
};
