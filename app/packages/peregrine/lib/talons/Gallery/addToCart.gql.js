import { gql } from '@apollo/client';
import { MiniCartFragment } from '../MiniCart/miniCartFragments.gql';

const ADD_ITEM = gql`
    mutation AddItemToCart($cartId: String!, $cartItem: CartItemInput!) {
        addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
            cart {
                id
                ...MiniCartFragment
            }
        }
    }
    ${MiniCartFragment}
`;
export default {
    ADD_ITEM
};
