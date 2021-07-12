import gql from 'graphql-tag';

const ADD_PRODUCT_TO_CART = gql`
mutation AddItemToCart(
    $cartId: String!
    $cartItem: CartItemInput!
)
{
    addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
        cart {
            id
        }
    }

products(search: $searchString) {
    items {
      id
      name
      only_x_left_in_stock
      stock_status
      url_key
			url_suffix
      }
    }
`;

export default {
    ADD_PRODUCT_TO_CART
};