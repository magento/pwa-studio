import { gql } from '@apollo/client';

import { AccountInformationPageFragment } from './accountInformationPageFragment.gql';
import { CustomerAddressBookAddressFragment } from '@magento/peregrine/lib/talons/AddressBookPage/addressBookFragments.gql';

export const CHANGE_CUSTOMER_PASSWORD = gql`
    mutation ChangeCustomerPassword($currentPassword: String!, $newPassword: String!) {
        changeCustomerPassword(
            currentPassword: $currentPassword
            newPassword: $newPassword # eslint-disable-next-line @graphql-eslint/require-id-when-available
        ) {
            email
        }
    }
`;

export const ADD_NEW_CUSTOMER_ADDRESS = gql`
    mutation AddNewCustomerAddressToAddressBook($address: CustomerAddressInput!) {
        createCustomerAddress(input: $address) {
            # We don't manually write to the cache to update the collection
            # after adding a new address so there's no need to query for a bunch
            # of address fields here. We use refetchQueries to refresh the list.
            id
        }
    }
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
    mutation DeleteCustomerAddressFromAddressBook($addressId: Int!) {
        deleteCustomerAddress(id: $addressId)
    }
`;

export const GET_CUSTOMER_INFORMATION = gql`
    query GetCustomerInformation {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            ...AccountInformationPageFragment
        }
    }
    ${AccountInformationPageFragment}
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

export const SET_CUSTOMER_INFORMATION = gql`
    mutation SetCustomerInformation($customerInput: CustomerInput!) {
        updateCustomer(input: $customerInput) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            customer {
                ...AccountInformationPageFragment
            }
        }
    }
    ${AccountInformationPageFragment}
`;

export default {
    changeCustomerPasswordMutation: CHANGE_CUSTOMER_PASSWORD,
    createCustomerAddressMutation: ADD_NEW_CUSTOMER_ADDRESS,
    deleteCustomerAddressMutation: DELETE_CUSTOMER_ADDRESS,
    getCustomerInformationQuery: GET_CUSTOMER_INFORMATION,
    setCustomerInformationMutation: SET_CUSTOMER_INFORMATION,
    updateCustomerAddressMutation: UPDATE_CUSTOMER_ADDRESS
};
