import { gql } from '@apollo/client';

export const GET_PAYMENT_METHODS = gql`
    query getPaymentMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            available_payment_methods {
                code
                title
            }
        }
    }
`;

export default {
    queries: {
        getPaymentMethodsQuery: GET_PAYMENT_METHODS
    },
    mutations: {}
};
