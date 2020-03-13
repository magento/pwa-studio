import gql from 'graphql-tag';

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        total_quantity
    }
`;
