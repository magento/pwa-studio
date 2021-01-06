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

const GET_ROOT_CATEGORY_ID = gql`
    query getRootCategoryId {
        storeConfig {
            id
            root_category_id
        }
    }
`;

export default {
    getCustomerQuery: GET_CUSTOMER,
    getRootCategoryId: GET_ROOT_CATEGORY_ID
};
