import { gql } from '@apollo/client';

export const GET_CUSTOMER = gql`
    query GetCustomerAfterSignIn {
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
