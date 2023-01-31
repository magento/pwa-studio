import { gql } from '@apollo/client';
import { CartPageFragment } from './cartPageFragments.gql';

const GET_CART_DETAILS = gql`
    query GetCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;

export const CREATE_CART = gql`
    mutation CreateCart {
        cartId: createEmptyCart
    }
`;

export const IS_USER_AUTHED = gql`
    query IsUserAuthed($cartId: String!) {
        cart(cart_id: $cartId) {
            # The purpose of this query is to check that the user is authorized
            # to query on the current cart. Just fetch "id" to keep it small.
            id
        }
    }
`;

export default {
    getCartDetailsQuery: GET_CART_DETAILS,
    createCartMutation: CREATE_CART,
    IsUserAuthedQuery: IS_USER_AUTHED
};
