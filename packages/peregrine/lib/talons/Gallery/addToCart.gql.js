import gql from 'graphql-tag';

const ADD_PRODUCT_TO_CART = gql`
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

const ADD_ITEM = gql `
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
`;
export default {
    ADD_PRODUCT_TO_CART,
    ADD_ITEM
};