import gql from 'graphql-tag';

export const GiftCardSummaryFragment = gql`
    fragment GiftCardSummaryFragment on Cart {
        applied_gift_cards {
            applied_balance {
                value
                currency
            }
        }
    }
`;
