import { gql } from '@apollo/client';

import { CustomerAddressBookAddressFragment } from './addressBookFragments.gql';

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

/**
 * We use the connection key directive here because Apollo will save
 * this customer's PII in localStorage if not.
 */
export const ADD_NEW_CUSTOMER_ADDRESS = gql`
    mutation AddNewCustomerAddressToAddressBook(
        $address: CustomerAddressInput!
    ) {
        createCustomerAddress(input: $address)
            @connection(key: "createCustomerAddress") {
            # We don't manually write to the cache to update the collection
            # after adding a new address so there's no need to query for a bunch
            # of address fields here. We use refetchQueries to refresh the list.
            id
        }
    }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
    mutation UpdateCustomerAddressInAddressBook(
        $addressId: Int!
        $updated_address: CustomerAddressInput!
    ) {
        updateCustomerAddress(id: $addressId, input: $updated_address)
            @connection(key: "updateCustomerAddress") {
            id
            ...CustomerAddressBookAddressFragment
        }
    }
    ${CustomerAddressBookAddressFragment}
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
    updateCustomerAddressMutation: UPDATE_CUSTOMER_ADDRESS
};
