import { gql } from '@apollo/client';

export const GET_CUSTOMER_DETAILS = gql`
    query accountChipQuery {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            firstname
        }
    }
`;
