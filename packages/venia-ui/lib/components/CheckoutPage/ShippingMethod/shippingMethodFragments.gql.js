import { gql } from '@apollo/client';

/**
 * WARNING: This fragment can cause slowdowns on the network request because it
 * causes the backend to make remote queries to carriers for real-time data.
 * Make sure you are conscious about the side effects when including it in queries and mutations.
 */
export const AvailableShippingMethodsCheckoutFragment = gql`
    fragment AvailableShippingMethodsCheckoutFragment on Cart {
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

export const SelectedShippingMethodCheckoutFragment = gql`
    fragment SelectedShippingMethodCheckoutFragment on Cart {
        id
        shipping_addresses {
            selected_shipping_method {
                amount {
                    currency
                    value
                }
                carrier_code
                method_code
                method_title
            }
            street
        }
    }
`;

export const ShippingMethodsCheckoutFragment = gql`
    fragment ShippingMethodsCheckoutFragment on Cart {
        id
        ...AvailableShippingMethodsCheckoutFragment
        ...SelectedShippingMethodCheckoutFragment
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
    ${AvailableShippingMethodsCheckoutFragment}
    ${SelectedShippingMethodCheckoutFragment}
`;
