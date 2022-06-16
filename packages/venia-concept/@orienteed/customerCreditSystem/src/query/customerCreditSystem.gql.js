import { gql } from '@apollo/client';

export const GET_PAYMENT_CREDIT_SYSTEM_CONFIG = gql`
    query getWebkulPaymentCreditsystemConfig {
        WebkulPaymentCreditsystemConfig {
            currencysymbol
            getcurrentcode
            grand_total
            grand_total_formatted
            leftincredit
            remainingcredit
            remainingcreditcurrentcurrency
            remainingcreditformatted
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "creditsystem" } }) {
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
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};
