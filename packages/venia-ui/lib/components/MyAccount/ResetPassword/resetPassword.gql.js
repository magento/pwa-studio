import gql from 'graphql-tag';

export const RESET_PASSWORD_MUTATION = gql`
    mutation resetPassword(
        $email: String!
        $token: String!
        $newPassword: String!
    ) {
        resetPassword(
            email: $email
            resetPasswordToken: $token
            newPassword: $newPassword
        ) @connection(key: "resetPassword")
    }
`;

export default {
    queries: {},
    mutations: {
        resetPasswordMutation: RESET_PASSWORD_MUTATION
    }
};
