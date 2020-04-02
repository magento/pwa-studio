import gql from 'graphql-tag';

export const CartTriggerFragment = gql`
    fragment CartTriggerFragment on Cart {
        id
        total_quantity
    }
`;
