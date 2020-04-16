import gql from 'graphql-tag';
import { CheckoutPageFragment } from './checkoutPageFragments.gql';
import { OrderConfirmationPageFragment } from './OrderConfirmationPage/orderConfirmationPageFragments.gql';

export const CREATE_CART = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
`;

export const PLACE_ORDER = gql`
    mutation placeOrder($cartId: String!) {
        placeOrder(input: { cart_id: $cartId }) @connection(key: "placeOrder") {
            order {
                order_number
            }
        }
    }
`;

// A query to fetch order details _right_ before we submit, so that we can pass
// data to the order confirmation page.
export const GET_ORDER_DETAILS = gql`
    query getOrderDetails($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...OrderConfirmationPageFragment
        }
    }
    ${OrderConfirmationPageFragment}
`;

export const GET_CHECKOUT_DETAILS = gql`
    query getCheckoutDetails($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */
export const GET_CHECKOUT_STEP = gql`
    query getCheckoutStep($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            # The current checkout step, stored locally for persistence.
            checkoutStep @client
        }
    }
`;
/* eslint-enable graphql/template-strings */

export default {
    mutations: {
        createCartMutation: CREATE_CART,
        placeOrderMutation: PLACE_ORDER
    },
    queries: {
        getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
        getCheckoutStepQuery: GET_CHECKOUT_STEP,
        getOrderDetailsQuery: GET_ORDER_DETAILS
    }
};
