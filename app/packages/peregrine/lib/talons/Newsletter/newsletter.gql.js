import { gql } from '@apollo/client';

export const SUBSCRIBE_TO_NEWSLETTER = gql`
    mutation SubscribeToNewsletter($email: String!) {
        subscribeEmailToNewsletter(email: $email) {
            status
        }
    }
`;

export default {
    subscribeToNewsletterMutation: SUBSCRIBE_TO_NEWSLETTER
};
