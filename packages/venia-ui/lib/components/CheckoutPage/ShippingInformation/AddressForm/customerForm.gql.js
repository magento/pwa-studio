import gql from 'graphql-tag';

import { GET_CUSTOMER_ADDRESSES } from '../../AddressBook/addressBook.gql';
import { CustomerAddressFragment } from '../../AddressBook/addressBookFragments.gql';
import { GET_DEFAULT_SHIPPING } from '../shippingInformation.gql';

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

export const GET_CUSTOMER_QUERY = gql`
    query GetCustomer {
        customer {
            id
            default_shipping
            email
            firstname
            lastname
        }
    }
`;

export default {
    mutations: {
        createCustomerAddressMutation: CREATE_CUSTOMER_ADDRESS_MUTATION,
        updateCustomerAddressMutaton: UPDATE_CUSTOMER_ADDRESS_MUTATION
    },
    queries: {
        getCustomerQuery: GET_CUSTOMER_QUERY,
        getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
        getDefaultShippingQuery: GET_DEFAULT_SHIPPING
    }
};
