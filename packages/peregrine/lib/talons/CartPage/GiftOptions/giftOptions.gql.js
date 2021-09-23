import { gql } from '@apollo/client';

const SET_GIFT_OPTION = gql`
    mutation setGiftOptionsOnCart(
        $cartId: String!
        $giftMessage: GiftMessageInput!
        $giftReceiptIncluded: Boolean!
        $printedCardIncluded: Boolean!
    ) {
        setGiftOptionsOnCart(
            input: {
                cart_id: $cartId
                gift_message: $giftMessage
                gift_receipt_included: $giftReceiptIncluded
                printed_card_included: $printedCardIncluded
            }
        ) {
            cart {
                id
                gift_message {
                    to
                    from
                    message
                }
                gift_receipt_included
                printed_card_included
            }
        }
    }
`;

const GET_GIFT_OPTION = gql`
    query getGiftOptionsOnCart($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            gift_message {
                from
                to
                message
            }
            gift_receipt_included
            printed_card_included
        }
    }
`;
export default {
    getGiftOptionsOnCartQuery: GET_GIFT_OPTION,
    setGiftOptionsOnCartMutation: SET_GIFT_OPTION
};
