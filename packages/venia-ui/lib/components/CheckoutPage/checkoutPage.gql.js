import gql from 'graphql-tag';
import { CheckoutPageFragment } from './checkoutPageFragments.gql';

export const CREATE_CART_MUTATION = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
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
        createCartMutation: CREATE_CART_MUTATION
    },
    queries: {
        getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
        getCheckoutStepQuery: GET_CHECKOUT_STEP
    }
};
