import { gql } from '@apollo/client';

export const GET_CHECKMO_CONFIG_DATA = gql`
    query storeConfigData {
        storeConfig {
            id
            payment_checkmo_payable_to @client
            payment_checkmo_mailing_address @client
        }
    }
`;

export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query getIsBillingAddressSame($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            isBillingAddressSame
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
            }
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "checkmo" } }
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
    getCheckmoConfigQuery: GET_CHECKMO_CONFIG_DATA,
    getBillingAddressQuery: GET_BILLING_ADDRESS,
    getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
    getShippingAddressQuery: GET_SHIPPING_ADDRESS,
    setBillingAddressMutation: SET_BILLING_ADDRESS,
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};
