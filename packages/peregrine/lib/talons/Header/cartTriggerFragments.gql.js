import { gql } from '@apollo/client';

export const CartTriggerFragment = gql`
    fragment CartTriggerFragment on Cart {
        id
        total_quantity
    }
`;
