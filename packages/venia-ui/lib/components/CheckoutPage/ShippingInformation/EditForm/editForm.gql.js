import gql from 'graphql-tag';

import { SET_DEFAULT_ADDRESS } from '../shippingInformation.gql';
import { ShippingInformationFragment } from '../shippingInformationFragments.gql';
import { ShippingMethodsFragment } from '../../ShippingMethod/shippingMethodFragments.gql';
import { GET_CUSTOMER_ADDRESSES } from '../../AddressBook/addressBook.gql';
import { CustomerAddressFragment } from '../../AddressBook/addressBookFragments.gql';

export const CREATE_CUSTOMER_ADDRESS_MUTATION = gql`
    mutation CreateCustomerAddress($address: CustomerAddressInput!) {
        createCustomerAddress(input: $address)
            @connection(key: "createCustomerAddress") {
            id
            ...CustomerAddressFragment
        }
    }
    ${CustomerAddressFragment}
`;

export const UPDATE_CUSTOMER_ADDRESS_MUTATION = gql`
    mutation UpdateCustomerAddress(
        $addressId: Int!
        $address: CustomerAddressInput!
    ) {
        updateCustomerAddress(id: $addressId, input: $address)
            @connection(key: "updateCustomerAddress") {
            id
            ...CustomerAddressFragment
        }
    }
    ${CustomerAddressFragment}
`;

export const SET_GUEST_SHIPPING_MUTATION = gql`
    mutation SetGuestShipping(
        $cartId: String!
        $email: String!
        $address: CartAddressInput!
    ) {
        setGuestEmailOnCart(input: { cart_id: $cartId, email: $email })
            @connection(key: "setGuestEmailOnCart") {
            cart {
                id
            }
        }

        setShippingAddressesOnCart(
            input: {
                cart_id: $cartId
                shipping_addresses: [{ address: $address }]
            }
        ) @connection(key: "setShippingAddressesOnCart") {
            cart {
                id
                ...ShippingInformationFragment
                ...ShippingMethodsFragment
            }
        }
    }
    ${ShippingInformationFragment}
    ${ShippingMethodsFragment}
`;

export default {
    mutations: {
        createCustomerAddressMutation: CREATE_CUSTOMER_ADDRESS_MUTATION,
        setDefaultAddressMutation: SET_DEFAULT_ADDRESS,
        setGuestShippingMutation: SET_GUEST_SHIPPING_MUTATION,
        updateCustomerAddressMutaton: UPDATE_CUSTOMER_ADDRESS_MUTATION
    },
    queries: {
        getCustomerAddresses: GET_CUSTOMER_ADDRESSES
    }
};
