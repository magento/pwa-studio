import { gql } from '@apollo/client';

export const GET_CUSTOMER_DETAILS = gql`
    query accountChipQuery {
        customer {
            id
            firstname
        }
    }
`;
