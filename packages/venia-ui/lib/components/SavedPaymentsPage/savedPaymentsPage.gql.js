import { gql } from '@apollo/client';

export const GET_SAVED_PAYMENTS_QUERY = gql`
    query getSavedPayments {
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
    queries: {
        GET_SAVED_PAYMENTS_QUERY
    }
};
