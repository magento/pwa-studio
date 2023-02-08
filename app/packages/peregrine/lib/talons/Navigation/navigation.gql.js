import { gql } from '@apollo/client';

export const GET_CUSTOMER = gql`
    query GetCustomerForLeftNav {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export default {
    getCustomerQuery: GET_CUSTOMER
};
