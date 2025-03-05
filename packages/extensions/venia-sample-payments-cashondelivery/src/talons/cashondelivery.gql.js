import { gql } from '@apollo/client';

export const SET_COD_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: { code: "cashondelivery" }
            }
        ) {
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
    setCodPaymentMethodOnCartMutation: SET_COD_PAYMENT_METHOD_ON_CART
};
