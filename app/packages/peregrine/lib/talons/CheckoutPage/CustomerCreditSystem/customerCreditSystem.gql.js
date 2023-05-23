import { gql } from '@apollo/client';

export const GET_WEBKUL_PAYMENT_CREDIT_SYSTEM_CONFIG = gql`
    query GetWebkulPaymentCreditSystemConfig {
        WebkulPaymentCreditsystemConfig {
            currencysymbol
            getcurrentcode
            grand_total
            grand_total_formatted
            leftincredit
            remainingcredit
            remainingcreditcurrentcurrency
            remainingcreditformatted
        }
    }
`;

export default {
    getWebkulPaymentCreditSystemConfigQuery: GET_WEBKUL_PAYMENT_CREDIT_SYSTEM_CONFIG
};
