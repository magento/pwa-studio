import gql from 'graphql-tag';

/**
 * WARNING: This fragment can cause slowdowns on the network request because it
 * causes the backend to make remote queries to carriers for real-time data.
 * It is intentionally not included in the CartPageFragment. Make sure you are
 * conscious about the side effects when including it in queries and mutations.
 */
export const AvailableShippingMethodsFragment = gql`
    fragment AvailableShippingMethodsFragment on Cart {
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
        }
    }
`;

export const SelectedShippingMethodFragment = gql`
    fragment SelectedShippingMethodFragment on Cart {
        id
        shipping_addresses {
            selected_shipping_method {
                carrier_code
                method_code
            }
        }
    }
`;

export const ShippingMethodsFragment = gql`
    fragment ShippingMethodsFragment on Cart {
        id
        ...AvailableShippingMethodsFragment
        ...SelectedShippingMethodFragment
        shipping_addresses {
            country {
                code
            }
            postcode
            region {
                code
            }
        }
    }
    ${AvailableShippingMethodsFragment}
    ${SelectedShippingMethodFragment}
`;
