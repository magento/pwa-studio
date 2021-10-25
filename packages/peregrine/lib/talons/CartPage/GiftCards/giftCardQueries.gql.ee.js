import { gql } from '@apollo/client';

import { CartPageFragment } from '../cartPageFragments.gql';
import { GiftCardFragment } from './giftCardFragments.gql';

const GET_APPLIED_GIFT_CARDS_QUERY = gql`
    query getAppliedGiftCards($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...GiftCardFragment
        }
    }
    ${GiftCardFragment}
`;

const GET_GIFT_CARD_BALANCE_QUERY = gql`
    query getGiftCardBalance($giftCardCode: String!) {
        giftCardAccount(input: { gift_card_code: $giftCardCode }) {
            balance {
                currency
                value
            }
            code
            expiration_date
            id: code
        }
    }
`;

const APPLY_GIFT_CARD_MUTATION = gql`
    mutation applyGiftCardToCart($cartId: String!, $giftCardCode: String!) {
        applyGiftCardToCart(
            input: { cart_id: $cartId, gift_card_code: $giftCardCode }
        ) {
            cart {
                id
                ...CartPageFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
            }
        }
    }
    ${CartPageFragment}
`;

const REMOVE_GIFT_CARD_MUTATION = gql`
    mutation removeGiftCard($cartId: String!, $giftCardCode: String!) {
        removeGiftCardFromCart(
            input: { cart_id: $cartId, gift_card_code: $giftCardCode }
        ) {
            cart {
                id
                ...CartPageFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
            }
        }
    }
    ${CartPageFragment}
`;

export default {
    getAppliedGiftCardsQuery: GET_APPLIED_GIFT_CARDS_QUERY,
    getGiftCardBalanceQuery: GET_GIFT_CARD_BALANCE_QUERY,
    applyGiftCardMutation: APPLY_GIFT_CARD_MUTATION,
    removeGiftCardMutation: REMOVE_GIFT_CARD_MUTATION
};
