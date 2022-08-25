import { gql } from '@apollo/client';

export const SIGN_OUT = gql`
    mutation SignOutFromModal {
        revokeCustomerToken {
            result
        }
    }
`;

export default {
    signOutMutation: SIGN_OUT
};
