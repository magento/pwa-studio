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

export default {
    getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES
};
