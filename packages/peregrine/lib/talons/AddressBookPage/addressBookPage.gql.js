import { gql } from '@apollo/client';

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddressesForAddressBook {
        customer {
            id
            addresses {
                id
                city
                country_code
                default_billing
                default_shipping
                firstname
                lastname
                postcode
                region {
                    region
                    region_code
                    region_id
                }
                street
                telephone
            }
        }

        countries {
            id
            full_name_locale
        }
    }
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
    mutation DeleteCustomerAddressFromAddressBook($addressId: Int!) {
        deleteCustomerAddress(id: $addressId)
    }
`;

export default {
    deleteCustomerAddressMutation: DELETE_CUSTOMER_ADDRESS,
    getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES
};
