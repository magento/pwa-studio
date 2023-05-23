import gql from 'graphql-tag';

export const RESET_PASSWORD = gql`
    mutation ResetPassword($email: String!, $token: String!, $newPassword: String!) {
        resetPassword(email: $email, resetPasswordToken: $token, newPassword: $newPassword)
    }
`;

export default {
    resetPasswordMutation: RESET_PASSWORD
};
