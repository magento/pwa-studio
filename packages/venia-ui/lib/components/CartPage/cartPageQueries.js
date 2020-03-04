import gql from 'graphql-tag';
import { CartPageFragment } from './cartPageFragments';

export const GET_CART_DETAILS = gql`
    query getCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;

export const GET_CART_IS_UPDATING = gql`
    {
        cartIsUpdating @client
    }
`;
