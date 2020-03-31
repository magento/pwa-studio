import gql from 'graphql-tag';

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        # If total quantity is falsy we render empty.
        total_quantity
    }
`;
