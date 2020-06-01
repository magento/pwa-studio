import gql from 'graphql-tag';

export const ShippingInformationFragment = gql`
    fragment ShippingInformationFragment on Cart {
        id
        email
        shipping_addresses {
            city
            country {
                code
                label
            }
            firstname
            lastname
            postcode
            region {
                code
                label
            }
            street
            telephone
        }
    }
`;
