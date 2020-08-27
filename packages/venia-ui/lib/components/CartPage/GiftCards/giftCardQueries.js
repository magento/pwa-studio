import { gql } from '@apollo/client';

import { CartPageFragment } from '../cartPageFragments.gql';
import { GiftCardFragment } from './giftCardFragments';

export const GET_APPLIED_GIFT_CARDS_QUERY = gql`
    query getAppliedGiftCards($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...GiftCardFragment
        }
    }
    ${GiftCardFragment}
`;

export const GET_GIFT_CARD_BALANCE_QUERY = gql`
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

export const APPLY_GIFT_CARD_MUTATION = gql`
    mutation applyGiftCardToCart($cartId: String!, $giftCardCode: String!) {
        applyGiftCardToCart(
            input: { cart_id: $cartId, gift_card_code: $giftCardCode }
        ) @connection(key: "applyGiftCardToCart") {
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

export const REMOVE_GIFT_CARD_MUTATION = gql`
    mutation removeGiftCard($cartId: String!, $giftCardCode: String!) {
        removeGiftCardFromCart(
            input: { cart_id: $cartId, gift_card_code: $giftCardCode }
        ) @connection(key: "removeGiftCardFromCart") {
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
