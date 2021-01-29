import { gql } from '@apollo/client';

/**
 * WARNING: This fragment can cause slowdowns on the network request because it
 * causes the backend to make remote queries to carriers for real-time data.
 * It is intentionally not included in the CartPageFragment. Make sure you are
 * conscious about the side effects when including it in queries and mutations.
 */
export const AvailableShippingMethodsCartFragment = gql`
    fragment AvailableShippingMethodsCartFragment on Cart {
        id
        shipping_addresses {
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
            street
        }
    }
`;

export const SelectedShippingMethodCartFragment = gql`
    fragment SelectedShippingMethodCartFragment on Cart {
        id
        shipping_addresses {
            selected_shipping_method {
                carrier_code
                method_code
            }
            street
        }
    }
`;

export const ShippingMethodsCartFragment = gql`
    fragment ShippingMethodsCartFragment on Cart {
        id
        ...AvailableShippingMethodsCartFragment
        ...SelectedShippingMethodCartFragment
        shipping_addresses {
            country {
                code
            }
            postcode
            region {
                code
            }
            street
        }
    }
    ${AvailableShippingMethodsCartFragment}
    ${SelectedShippingMethodCartFragment}
`;
