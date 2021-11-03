import { gql } from '@apollo/client';

const GET_GIFT_OPTIONS = gql`
    query getGiftOptions($cartId: String!) {
        cart(cart_id: $cartId) @client {
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

// Currently Commerce only
const SET_GIFT_OPTIONS_ON_CART = gql`
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

export default {
    getGiftOptionsQuery: GET_GIFT_OPTIONS,
    setGiftOptionsOnCartMutation: SET_GIFT_OPTIONS_ON_CART
};
