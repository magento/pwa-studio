import { gql } from '@apollo/client';

import { CustomerAddressBookAddressFragment } from './addressBookFragments.gql';
import { ShippingInformationFragment } from '../CheckoutPage/ShippingInformation/shippingInformationFragments.gql';

export const ADD_NEW_CUSTOMER_ADDRESS = gql`
    mutation AddNewCustomerAddressToAddressBook($address: CustomerAddressInput!) {
        createCustomerAddress(input: $address) {
            id
            ...CustomerAddressBookAddressFragment
        }
    }
    ${CustomerAddressBookAddressFragment}
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
    mutation UpdateCustomerAddressInAddressBook($addressId: Int!, $updated_address: CustomerAddressInput!) {
        updateCustomerAddress(id: $addressId, input: $updated_address) {
            id
            ...CustomerAddressBookAddressFragment
        }
    }
    ${CustomerAddressBookAddressFragment}
`;

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddressesForAddressBook {
        customer {
            id
            addresses {
                id
                ...CustomerAddressBookAddressFragment
            }
        }
        countries {
            id
            full_name_locale
        }
    }
    ${CustomerAddressBookAddressFragment}
`;

export const GET_CUSTOMER_CART_ADDRESSES = gql`
    query GetCustomerCartAddressesForAddressBook {
        customerCart {
            id
            ...ShippingInformationFragment
        }
    }
    ${ShippingInformationFragment}
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
    mutation DeleteCustomerAddressFromAddressBook($addressId: Int!) {
        deleteCustomerAddress(id: $addressId)
    }
`;

export default {
    createCustomerAddressMutation: ADD_NEW_CUSTOMER_ADDRESS,
    deleteCustomerAddressMutation: DELETE_CUSTOMER_ADDRESS,
    getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
    getCustomerCartAddressQuery: GET_CUSTOMER_CART_ADDRESSES,
    updateCustomerAddressMutation: UPDATE_CUSTOMER_ADDRESS
};
