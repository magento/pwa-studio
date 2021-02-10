import { gql } from '@apollo/client';

export const TaxSummaryFragment = gql`
    fragment TaxSummaryFragment on CartPrices {
        applied_taxes {
            amount {
                currency
                value
            }
        }
    }
`;
