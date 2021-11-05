import { gql } from '@apollo/client';

export const GiftOptionsFragment = gql`
    fragment GiftOptionsFragment on Cart {
        __typename
        id
        gift_message {
            from
            to
            message
        }
        gift_receipt_included
        printed_card_included
    }
`;
