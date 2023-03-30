import { gql } from '@apollo/client';

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
            token
        }
    }
`;

export default {
    signInMutation: SIGN_IN
};
