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

/**
 * We would normally use the CustomerAddressFragment here for the response
 * but due to GraphQL returning null region data, we return minimal data and
 * rely on refetching after performing this mutation to get accurate data.
 *
 * Fragment will be added back after MC-33948 is resolved.
 */
export const UPDATE_CUSTOMER_ADDRESS_MUTATION = gql`
    mutation UpdateCustomerAddress(
        $addressId: Int!
        $address: CustomerAddressInput!
    ) {
        updateCustomerAddress(id: $addressId, input: $address)
            @connection(key: "updateCustomerAddress") {
            id
        }
    }
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
        updateCustomerAddressMutation: UPDATE_CUSTOMER_ADDRESS_MUTATION
    },
    queries: {
        getCustomerQuery: GET_CUSTOMER_QUERY,
        getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
        getDefaultShippingQuery: GET_DEFAULT_SHIPPING
    }
};
