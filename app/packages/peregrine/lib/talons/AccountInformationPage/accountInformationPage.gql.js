import { gql } from '@apollo/client';

import { AccountInformationPageFragment } from './accountInformationPageFragment.gql';

export const CHANGE_CUSTOMER_PASSWORD = gql`
    mutation ChangeCustomerPassword($currentPassword: String!, $newPassword: String!) {
        changeCustomerPassword(
            currentPassword: $currentPassword
            newPassword: $newPassword # eslint-disable-next-line @graphql-eslint/require-id-when-available
        ) {
            email
        }
    }
`;

export const GET_CUSTOMER_INFORMATION = gql`
    query GetCustomerInformation {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            ...AccountInformationPageFragment
        }
    }
    ${AccountInformationPageFragment}
`;

export const SET_CUSTOMER_INFORMATION = gql`
    mutation SetCustomerInformation($customerInput: CustomerInput!) {
        updateCustomer(input: $customerInput) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            customer {
                ...AccountInformationPageFragment
            }
        }
    }
    ${AccountInformationPageFragment}
`;

export default {
    changeCustomerPasswordMutation: CHANGE_CUSTOMER_PASSWORD,
    getCustomerInformationQuery: GET_CUSTOMER_INFORMATION,
    setCustomerInformationMutation: SET_CUSTOMER_INFORMATION
};
