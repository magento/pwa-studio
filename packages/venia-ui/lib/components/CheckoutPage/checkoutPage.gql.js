import gql from 'graphql-tag';

export const SIGN_OUT = gql`
    mutation signOut {
        revokeCustomerToken {
            result
        }
    }
`;
