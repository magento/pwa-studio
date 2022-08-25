import { gql } from '@apollo/client';

export const SUBSCRIBE_TO_NEWSLETTER = gql`
    mutation SubscribeToNewsletter($email: String!) {
        subscribeEmailToNewsletter(email: $email) {
            status
        }
    }
`;

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForNewsletter {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            newsletter_enabled
        }
    }
`;

export default {
    subscribeMutation: SUBSCRIBE_TO_NEWSLETTER,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
