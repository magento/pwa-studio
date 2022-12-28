import { gql } from '@apollo/client';

export const SavedPaymentsFragment = gql`
    fragment SavedPaymentsFragment on CustomerPaymentTokens {
        items {
            details
            public_hash
            payment_method_code
        }
    }
`;

export const GET_SAVED_PAYMENTS_QUERY = gql`
    query GetSavedPayments {
        customerPaymentTokens {
            ...SavedPaymentsFragment
        }
    }
    ${SavedPaymentsFragment}
`;

export default {
    getSavedPaymentsQuery: GET_SAVED_PAYMENTS_QUERY
};
