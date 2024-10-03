import { gql } from '@apollo/client';
/**
 *
 * @type {DocumentNode}
 */
export const GET_BRAINTREE_CLIENT_TOKEN = gql`
    mutation {
        createBraintreeClientToken
    }
`;
