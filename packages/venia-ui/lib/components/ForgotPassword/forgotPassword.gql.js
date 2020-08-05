import gql from 'graphql-tag';

export const RESET_PASSWORD_MUTATION = gql`
    mutation requestPasswordResetEmail($email: String!) {
        requestPasswordResetEmail(email: $email)
    }
`;

export default {
    queries: {},
    mutations: {
        resetPasswordMutation: RESET_PASSWORD_MUTATION
    }
};
