import gql from 'graphql-tag';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        total_quantity
    }
`;
