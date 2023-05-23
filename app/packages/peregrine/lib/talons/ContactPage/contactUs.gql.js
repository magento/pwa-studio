import { gql } from '@apollo/client';

export const SUBMIT_CONTACT_FORM = gql`
    mutation SubmitContactForm($name: String!, $email: String!, $comment: String!, $telephone: String) {
        contactUs(input: { name: $name, email: $email, comment: $comment, telephone: $telephone }) {
            status
        }
    }
`;

export default {
    submitContactFormMutation: SUBMIT_CONTACT_FORM
};
