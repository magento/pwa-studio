import { gql } from '@apollo/client';

export const SET_GUEST_EMAIL_ON_CART = gql`
    mutation SetGuestEmailOnCart($cartId: String!, $email: String!) {
        setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
            cart {
                id
            }
        }
    }
`;

export default {
    setGuestEmailOnCartMutation: SET_GUEST_EMAIL_ON_CART
};
