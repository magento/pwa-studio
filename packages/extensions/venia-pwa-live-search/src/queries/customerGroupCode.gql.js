import { gql } from '@apollo/client';

export const GET_CUSTOMER_GROUP_CODE = gql`
    query GetCustomerForLiveSearch {
        customer {
            group_code
        }
    }
`;
