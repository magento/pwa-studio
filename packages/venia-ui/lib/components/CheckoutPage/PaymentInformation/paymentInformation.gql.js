import gql from 'graphql-tag';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */
export const GET_PAYMENT_INFORMATION = gql`
    query getPaymentInformation($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            paymentNonce @client
            prices {
                grand_total {
                    value
                }
            }
            available_payment_methods {
                code
                title
            }
            selected_payment_method {
                code
            }
        }
    }
`;

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            paymentNonce @client
        }
    }
`;
/* eslint-enable graphql/template-strings */

export const GET_CART_TOTAL = gql`
    query getCartTotal($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            prices {
                grand_total {
                    value
                }
            }
        }
    }
`;

// Sets the provided payment method object on the cart.
export const SET_PAYMENT_METHOD = gql`
    mutation setPaymentMethodOnCart(
        $cartId: String!
        $method: PaymentMethodInput!
    ) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: $method }
        ) @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export const paymentInformationResolvers = {
    Cart: {
        paymentNonce: (cart, _, { cache }) => {
            try {
                const cacheData = cache.readQuery({
                    query: GET_PAYMENT_NONCE
                });
                return cacheData.cart.paymentNonce || null;
            } catch (err) {
                // Normally you can rely on apollo's built-in behavior to
                // resolve @client directives, but _only_ if you init the cache.
                // This resolver and try-catch are just another way to handle
                // not having initialized cache.
                // See https://www.apollographql.com/docs/react/data/local-state/#querying-local-state
                return null;
            }
        }
    }
};

export default {
    queries: {
        getCartTotal: GET_CART_TOTAL,
        getPaymentInformation: GET_PAYMENT_INFORMATION
    },
    mutations: {
        setPaymentMethodMutation: SET_PAYMENT_METHOD
    }
};
