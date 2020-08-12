import gql from 'graphql-tag';

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
    }
`;
