import { gql } from '@apollo/client';

const ADD_ITEM = gql`
mutation AddItemToCart($cartId: String!, $cartItem: CartItemInput!) {
    addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
      cart {
        id
      }
    }
  }
`;
export default {
    ADD_ITEM
};