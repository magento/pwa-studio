import { gql } from '@apollo/client';

import { SavedPaymentsFragment } from './savedPaymentsPage.gql';

export const DELETE_CREDIT_CARD_PAYMENT = gql`
    mutation DeleteCreditCardPayment($paymentHash: String!) {
        deletePaymentToken(public_hash: $paymentHash) {
            customerPaymentTokens {
                ...SavedPaymentsFragment
            }
            result
        }
    }
    ${SavedPaymentsFragment}
`;

export default {
    deleteCreditCardPaymentMutation: DELETE_CREDIT_CARD_PAYMENT
};
