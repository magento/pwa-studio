import { gql } from '@apollo/client';

export const GiftCardSummaryFragment = gql`
    fragment GiftCardSummaryFragment on Cart {
        id
        applied_gift_cards {
            # code is used as the cache id now, so even though the summary
            # does not use "code", we must request it for caching.
            # The alternative may be to specify never to cache gift cards.
            code
            applied_balance {
                value
                currency
            }
        }
    }
`;
