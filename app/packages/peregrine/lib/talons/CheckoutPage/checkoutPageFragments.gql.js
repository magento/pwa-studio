import { gql } from '@apollo/client';

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        items {
            uid
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            product {
                uid
                stock_status
            }
        }
        # If total quantity is falsy we render empty.
        total_quantity
        available_payment_methods {
            code
        }
    }
`;
