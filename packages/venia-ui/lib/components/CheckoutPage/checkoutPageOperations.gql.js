import gql from 'graphql-tag';
import { CheckoutPageFragment } from './checkoutPageFragments.gql';

const CREATE_CART_MUTATION = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
`;

const GET_CHECKOUT_DETAILS = gql`
    query getCheckoutDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

const GET_CHECKOUT_STEP = gql`
    {
        # The current checkout step, stored locally for persistence.
        checkoutStep @client
    }
`;

export default {
    mutations: {
        createCartMutation: CREATE_CART_MUTATION
    },
    queries: {
        getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
        getCheckoutStepQuery: GET_CHECKOUT_STEP
    }
};
