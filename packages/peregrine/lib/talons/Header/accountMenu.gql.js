import { gql } from '@apollo/client';

export const SIGN_OUT = gql`
    mutation SignOutFromMenu {
        revokeCustomerToken {
            result
        }
    }
`;

export default {
    signOutMutation: SIGN_OUT
};
