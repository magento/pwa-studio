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
            checkoutStep @client
        }
    }
    ${CheckoutPageFragment}
`;

export default {
    mutations: {
        createCartMutation: CREATE_CART,
        placeOrderMutation: PLACE_ORDER
    },
    queries: {
        getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
        getOrderDetailsQuery: GET_ORDER_DETAILS
    }
};

export const checkoutPageResolvers = {
    Cart: {
        checkoutStep: (cart, _args, { cache }) => {
            // TODO: Replace with heuristic check against cart data. Requires
            // fetching more than just total quantity for checkout details query
            // "cart" arg will have server result.
            return cart.checkoutStep || 1;
        }
    }
    //     checkout_step: (_, args, { cache, getCacheKey }) => {
    //         /**
    //          * This is how the `cacheKeyFromType` saves the
    //          * cart data in the `InMemoryCache`.
    //          */
    //         const cartInCache = getCacheKey({
    //             __typename: 'Cart'
    //         });
    //         const { checkoutStep } = cache.data.data[cartInCache] || {};
    //         console.log('Step in resolver', checkoutStep);
    //         return {
    //             __typename: 'Cart',
    //             checkoutStep: checkoutStep || 1
    //         };
    //     }
    // }
};
