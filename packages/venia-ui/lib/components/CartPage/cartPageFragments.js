import gql from 'graphql-tag';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
    }
`;
