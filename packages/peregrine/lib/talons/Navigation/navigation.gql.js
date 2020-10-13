import { gql } from '@apollo/client';

export const GET_CUSTOMER = gql`
    query GetCustomerForLeftNav {
        customer {
            id
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
