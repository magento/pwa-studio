import gql from 'graphql-tag';


export const GET_SELECTED_PAYMENT_METHOD = gql`
    query getSelectedPaymentMethod($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            selectedPaymentMethod: selected_payment_method {
                code
            }
        }
    }
`;

/* eslint-enable graphql/template-strings */

export default {
    queries: {
        getSelectedPaymentMethodQuery: GET_SELECTED_PAYMENT_METHOD
    },
    mutations: {}
};
