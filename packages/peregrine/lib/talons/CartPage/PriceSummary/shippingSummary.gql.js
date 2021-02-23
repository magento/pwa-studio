import { gql } from '@apollo/client';

export const ShippingSummaryFragment = gql`
    fragment ShippingSummaryFragment on Cart {
        id
        shipping_addresses {
            selected_shipping_method {
                amount {
                    currency
                    value
                }
            }
            street
        }
    }
`;
