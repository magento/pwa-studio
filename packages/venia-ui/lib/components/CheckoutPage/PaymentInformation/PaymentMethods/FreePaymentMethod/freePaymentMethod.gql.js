import gql from 'graphql-tag';

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
    mutations: {
        setPaymentMethodMutation: SET_PAYMENT_METHOD
    }
};
