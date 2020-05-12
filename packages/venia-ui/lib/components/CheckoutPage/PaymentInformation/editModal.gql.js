import gql from 'graphql-tag';

export const GET_SELECTED_PAYMENT_METHOD = gql`
    query getSelectedPaymentMethod($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            selected_payment_method {
                code
            }
        }
    }
`;

export default {
    queries: {
        getSelectedPaymentMethodQuery: GET_SELECTED_PAYMENT_METHOD
    },
    mutations: {}
};
