import { gql } from '@apollo/client';

export const REQUEST_PASSWORD_RESET_EMAIL = gql`
    mutation RequestPasswordResetEmail($email: String!) {
        requestPasswordResetEmail(email: $email)
    }
`;

export default {
    requestPasswordResetEmailMutation: REQUEST_PASSWORD_RESET_EMAIL
};
