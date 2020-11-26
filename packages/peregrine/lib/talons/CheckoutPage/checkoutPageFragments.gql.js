import { gql } from '@apollo/client';

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        items {
            id
            product {
                id
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
