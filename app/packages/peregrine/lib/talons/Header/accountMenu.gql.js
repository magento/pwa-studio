import { gql } from '@apollo/client';

export const SIGN_OUT = gql`
    mutation SignOut {
        revokeCustomerToken {
            result
        }
    }
`;

export default {
    signOutMutation: SIGN_OUT
};
