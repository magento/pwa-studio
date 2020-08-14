import { gql } from '@apollo/client';

export const GiftCardSummaryFragment = gql`
    fragment GiftCardSummaryFragment on Cart {
        id
        applied_gift_cards {
            # code is "id" of the gift cards, used to merge cache data with incoming.
            code
            applied_balance {
                value
                currency
            }
        }
    }
`;
