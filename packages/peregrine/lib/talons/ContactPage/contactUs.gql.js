import { gql } from '@apollo/client';

export const SUBMIT_CONTACT_FORM = gql`
    mutation SubmitContactForm(
        $name: String!,
        $email: String!,
        $comment: String!,
        $telephone: String
    ) {
        contactUs(
            input: {
                name: $name,
                email: $email,
                comment: $comment,
                telephone: $telephone
            }
        ) {
            status
        }
    }
`;

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForContactUs {
        storeConfig {
            id
            contact_enabled
        }
    }
`;

export default {
    contactMutation: SUBMIT_CONTACT_FORM,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
