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

export default {
    queries: {
        getCartTotal: GET_CART_TOTAL,
        getPaymentInformation: GET_PAYMENT_INFORMATION
    },
    mutations: {}
};
