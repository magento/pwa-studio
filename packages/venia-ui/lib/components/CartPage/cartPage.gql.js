import gql from 'graphql-tag';
import { CartPageFragment } from './cartPageFragments.gql';

export const GET_CART_DETAILS = gql`
    query getCartDetails($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;
