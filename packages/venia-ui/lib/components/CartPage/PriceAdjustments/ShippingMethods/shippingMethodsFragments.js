import gql from 'graphql-tag';

export const ShippingMethodsFragment = gql`
    fragment ShippingMethodsFragment on Cart {
        id
        shipping_addresses {
            country {
                code
            }
            postcode
            region {
                code
            }
            available_shipping_methods {
                amount {
                    currency
                    value
                }
                available
                carrier_code
                carrier_title
                method_code
                method_title
            }
            selected_shipping_method {
                carrier_code
                method_code
            }
        }
    }
`;
