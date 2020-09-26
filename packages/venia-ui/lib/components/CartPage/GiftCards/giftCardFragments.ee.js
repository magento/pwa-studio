import { gql } from '@apollo/client';

export const GiftCardFragment = gql`
    fragment GiftCardFragment on Cart {
        applied_gift_cards {
            code
            current_balance {
                currency
                value
            }
        }
        id
    }
`;
