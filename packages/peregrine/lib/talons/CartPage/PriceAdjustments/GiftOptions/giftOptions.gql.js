import { gql } from '@apollo/client';

import { CartPageFragment } from '../../cartPageFragments.gql';
import { GiftOptionsFragment } from './giftOptionsFragments.gql';

const GET_GIFT_OPTIONS = gql`
    query GetGiftOptions($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...GiftOptionsFragment
        }
    }
    ${GiftOptionsFragment}
`;

// Currently Commerce only
const SET_GIFT_OPTIONS_ON_CART = gql`
    mutation SetGiftOptionsOnCart(
        $cartId: String!
        $giftMessage: GiftMessageInput
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
                ...CartPageFragment
                ...GiftOptionsFragment
            }
        }
    }
    ${CartPageFragment}
    ${GiftOptionsFragment}
`;

export default {
    getGiftOptionsQuery: GET_GIFT_OPTIONS,
    setGiftOptionsOnCartMutation: SET_GIFT_OPTIONS_ON_CART
};
