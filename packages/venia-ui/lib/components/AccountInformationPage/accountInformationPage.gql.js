import gql from 'graphql-tag';

export const SET_CUSTOMER_INFORMATION = gql`
    mutation SetCustomerInformation(
        $firstname: String!
        $lastname: String!
        $email: String!
    ) {
        updateCustomer(
            input: { firstname: $firstname, lastname: $lastname, email: $email }
        ) {
            customer {
                id
                firstname
                lastname
                email
            }
        }
    }
`;

export const CHANGE_CUSTOMER_PASSWORD = gql`
    mutation ChangeCustomerPassword(
        $currentPassword: String!
        $newPassword: String!
    ) {
        changeCustomerPassword(
            currentPassword: $currentPassword
            newPassword: $newPassword
        ) {
            id
            email
        }
    }
`;

export const GET_CUSTOMER_INFORMATION = gql`
    query GetCustomerInformation {
        customer {
            id
            firstname
            lastname
            email
        }
    }
`;

export default {
    mutations: {
        setCustomerInformationMutation: SET_CUSTOMER_INFORMATION,
        changeCustomerPasswordMutation: CHANGE_CUSTOMER_PASSWORD
    },
    queries: {
        getCustomerInformationQuery: GET_CUSTOMER_INFORMATION
    }
};
