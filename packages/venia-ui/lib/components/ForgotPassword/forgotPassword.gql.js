import gql from 'graphql-tag';

export const REQUEST_PASSWORD_RESET_EMAIL_MUTATION = gql`
    mutation requestPasswordResetEmail($email: String!) {
        requestPasswordResetEmail(email: $email)
            @connection(key: "requestPasswordResetEmail")
    }
`;

export default {
    queries: {},
    mutations: {
        requestPasswordResetEmailMutation: REQUEST_PASSWORD_RESET_EMAIL_MUTATION
    }
};
