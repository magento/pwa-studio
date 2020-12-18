import { gql } from '@apollo/client';

export const GET_SAVED_PAYMENTS_QUERY = gql`
    query GetSavedPayments {
        customerPaymentTokens {
            items {
                details
                public_hash
                payment_method_code
            }
        }
    }
`;

export default {
    getSavedPaymentsQuery: GET_SAVED_PAYMENTS_QUERY
};
