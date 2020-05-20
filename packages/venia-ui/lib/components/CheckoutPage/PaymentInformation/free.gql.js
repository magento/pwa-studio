import gql from 'graphql-tag';

export const SET_PAYMENT_METHOD_FREE = gql`
    mutation setSelectedPaymentMethod($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "free" } }
        ) @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selectedPaymentMethod: selected_payment_method {
                    code
                }
            }
        }
    }
`;

export default {
    queries: {},
    mutations: {
        setSelectedPaymentMethodFreeMutation: SET_PAYMENT_METHOD_FREE
    }
};
