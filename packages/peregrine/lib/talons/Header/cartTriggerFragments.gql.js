import { gql } from '@apollo/client';

export const CartTriggerFragment = gql`
    fragment CartTriggerFragment on Cart {
        id
        total_quantity
        total_summary_quantity_including_config
    }
`;
