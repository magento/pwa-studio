import gql from 'graphql-tag';

export const CustomerAddressFragment = gql`
    fragment CustomerAddressFragment on CustomerAddress {
        id
        city
        country_code
        default_billing
        firstname
        lastname
        postcode
        region {
            region_code
            region
        }
        street
        telephone
    }
`;

export const AddressBookFragment = gql`
    fragment AddressBookFragment on Customer {
        addresses {
            ...CustomerAddressFragment
        }
    }
    ${CustomerAddressFragment}
`;
