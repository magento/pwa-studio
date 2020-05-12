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
            selected_payment_method {
                code
            }
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

export default {
    queries: {
        getCartTotal: GET_CART_TOTAL,
        getPaymentInformation: GET_PAYMENT_INFORMATION
    },
    mutations: {
        setPaymentMethod: SET_PAYMENT_METHOD
    }
};
