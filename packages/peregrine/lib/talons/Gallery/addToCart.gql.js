import gql from 'graphql-tag';

const ADD_PRODUCT_TO_CART = gql`
    mutation AddProductToCartFromDialog(
        $cartId: String!
        $cartItem: CartItemInput!
    ) {
        addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
            cart {
                id
            }
        }
    }
`;

export default {
    ADD_PRODUCT_TO_CART
};