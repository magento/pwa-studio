import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';
import { AvailablePaymentMethodsFragment } from './paymentInformation.gql';

import { GET_CUSTOMER_ADDRESSES } from '../../AddressBookPage/addressBookPage.gql';
import { GET_BILLING_ADDRESS, SET_BILLING_ADDRESS } from '../BillingAddress/billingAddress.gql';

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
                }
                postcode
                phoneNumber: telephone
            }
        }
    }
`;

export const SET_CC_DETAILS_ON_CART = gql`
    mutation setSelectedPaymentMethod($cartId: String!, $paymentNonce: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "braintree"
                    braintree: { payment_method_nonce: $paymentNonce, is_active_payment_token_enabler: false }
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

export const SET_DEFAULT_BILLING_ADDRESS = gql`
    mutation setDefaultBillingAddress($cartId: String!, $customerAddressId: Int) {
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
    getPaymentNonceQuery: GET_PAYMENT_NONCE,
    getShippingAddressQuery: GET_SHIPPING_ADDRESS,
    setBillingAddressMutation: SET_BILLING_ADDRESS,
    setCreditCardDetailsOnCartMutation: SET_CC_DETAILS_ON_CART,
    getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
    setDefaultBillingAddressMutation: SET_DEFAULT_BILLING_ADDRESS
};
