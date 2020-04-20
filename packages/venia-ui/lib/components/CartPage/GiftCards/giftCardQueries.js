import gql from 'graphql-tag';

import { CartPageFragment } from '../cartPageFragments.gql';
import { GiftCardFragment } from './giftCardFragments';

export const GET_CART_GIFT_CARDS_QUERY = gql`
    query getCartDetails($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
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
            }
        }
    }
    ${CartPageFragment}
`;
